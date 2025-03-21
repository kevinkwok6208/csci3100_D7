const Cart = require('../models/Cart');
const Product = require('../models/Products');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const authService= require('./authService');

class CartService {

    async getUserProduct(username,productId){
        const user = await User.findOne({username:username});
        if (!user) {
        throw new Error('User not found');
        }

        if(productId ==0){
            return user;
        }
        const product = await Product.findOne({productID:productId});
        if (!product) {
        throw new Error('Product not found');
        }

        return { user, product };
    }
    
    async addToCart(username, productId, quantity) {
        try{
            const {user,product} = await this.getUserProduct(username,productId);
            //check if quantity is valid
            if (quantity > product.productStorage) {
                throw new Error('Quantity exceeds available stock');
            }
            let cart = await Cart.findOne({ userId: user._id });
            if (!cart) {
                // Create a new cart if user doesn't have one
                cart = new Cart({
                userId:user._id,
                items: [{
                    productId: product._id,
                    productPrice: product.productPrice*quantity,
                    quantity
                }]
                });
            }
            else {
                // Check if the product is already in the cart
                const existingItemIndex = cart.items.findIndex(
                    item => item.productId.toString() === product._id.toString()
                  );
                  
                  if (existingItemIndex >= 0) {
                    // Update quantity if product already in cart
                    cart.items[existingItemIndex].quantity += quantity;
                    if (cart.items[existingItemIndex].quantity > product.productStorage) {
                        throw new Error('Quantity exceeds available stock');
                    }
                  } else { 
                // Add the product to the cart if it's not already in it
                cart.items.push({
                    productId: product._id,
                    productPrice: product.productPrice,
                    quantity
                });
                }
            }
            await cart.save();
            return cart;
        } catch(error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    }

    async getCart(username){
        const user = await this.getUserProduct(username,0);
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }
        const subtotal = cart.items.reduce((total, item) => total + item.productPrice, 0);
        const cartdata=[{
            cart:cart,
            subtotal:subtotal
        }]
        return cartdata;
    }

    async removeFromCart(username, productId) {
        const { user, product } = await this.getUserProduct(username,productId);
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());
        if (itemIndex === -1) {
            throw new Error('Product not found in cart');
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return cart;
    }
    
    async updateCartItem(username, productId, quantity) {
        const { user, product } = await this.getUserProduct(username,productId);
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());
        if (itemIndex === -1) {
            throw new Error('Product not found in cart');
        }
        if (quantity > product.productStorage) {
            throw new Error('Quantity exceeds available stock');
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return cart;
    }

    async initiateCheckout(username) {
        try {
          await this.cleanupExpiredReservations();
          await this.removeReservation(username);
          const user = await this.getUserProduct(username, 0);
          const cart = await Cart.findOne({ userId: user._id });
          
          if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
          }
          

          const reservations = [];
          const reservationExpiryTime = 15; // expiry time in minutes
          
          // Verify each item's quantity against current stock
          for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`);
            }
            
            if (item.quantity > product.productStorage - product.productReservation) {
              throw new Error(`Not enough stock available for ${product.productName}. Available: ${product.productStorage - product.productReservation}`);
            }
            
            // Create a reservation for this item
            let currentime = new Date();
            const reservationDate = authService.adjustDateForTimezone(currentime);
            const expiryDate = new Date(reservationDate.getTime() + reservationExpiryTime * 60000);
            
            // Find and update in one operation, or create if not found
            const updatedReservation = await Reservation.findOneAndUpdate(
                { userId: user._id, productId: product._id,status: 'pending' },
                {
                quantity: item.quantity,
                reservationDate: reservationDate,
                expiryDate: expiryDate,
                },
                { new: true, upsert: true } // Return updated doc and create if not found
            );
            
            await updatedReservation.save();
            reservations.push(updatedReservation);
          }
          
          // The productReservation count in Products is automatically updated by the 
          // post-save hook in the Reservation model
          
          return {
            success: true,
            message: 'Checkout initiated successfully',
            reservations: reservations,
            expiresIn: reservationExpiryTime * 60 * 1000 // in milliseconds
          };
        } catch (error) {
          console.error('Error initiating checkout:', error);
          throw error;
        }
      }

      async removeReservation(username) {
        try {
          const user = await this.getUserProduct(username, 0);
          const reservations = await Reservation.find({ userId: user._id, status: 'pending' });
      
          if (reservations.length === 0) {
            return ('No reservations found');
          }
      
          // Update product reservation counts for each reservation
          for (const reservation of reservations) {
            await Product.findByIdAndUpdate(
              reservation.productId,
              { $inc: { productReservation: -reservation.quantity } },
              { new: true }
            );
          }
          
          // Delete all pending reservations for this user at once
          await Reservation.deleteMany({ userId: user._id, status: 'pending' });
      
          return {
            success: true,
            message: 'Reservations removed successfully',
            reservations: reservations
          };
        } catch (error) {
          console.error('Error removing reservations:', error);
          throw error;
        }
      }

      async cleanupExpiredReservations() {
        try {
          let now = new Date();
          now = authService.adjustDateForTimezone(now);
          
          // Find all pending reservations that have expired
          const expiredReservations = await Reservation.find({
            status: 'pending',
            expiryDate: { $lt: now }
          });
          
          if (expiredReservations.length === 0) {
            return { 
              success: true, 
              message: 'No expired reservations found',
              processed: 0 
            };
          }
          
          // Process each expired reservation
          for (const reservation of expiredReservations) {
            // Update product reservation count (decrease by reservation quantity)
            await Product.findByIdAndUpdate(
              reservation.productId,
              { $inc: { productReservation: -reservation.quantity } },
              { new: true }
            );
            
            // Delete the reservation entirely
            await Reservation.findByIdAndDelete(reservation._id);
          }
          
          return {
            success: true,
            message: 'Expired reservations removed successfully',
            processed: expiredReservations.length
          };
        } catch (error) {
          console.error('Error cleaning up expired reservations:', error);
          throw error;
        }
      }
}
module.exports = new CartService();