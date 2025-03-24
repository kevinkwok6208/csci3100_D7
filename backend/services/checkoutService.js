const Cart = require('../models/Cart');
const Product = require('../models/Products');
const Reservation = require('../models/Reservation');
const authService= require('./authService');
const cartService = require('./CartService');
const paypalService = require('./paypalService');
const emailService = require('./emailService');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
class CheckoutService {
    async initiateCheckout(username) {
            try {
              await this.cleanupExpiredReservations();
              await this.removeReservation(username);
              const user = await cartService.getUserProduct(username,0);
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
              const user = await cartService.getUserProduct(username, 0);
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
          
          // Clear the expired reservations every miniute
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

             // Add new methods for payment processing
    async createPayPalOrder(username, shippingInfo) {
      try {
          // Validate shipping info
          if (!shippingInfo || !shippingInfo.name || !shippingInfo.address) {
              throw new Error('Name and shipping address are required');
          }

          // Get user and cart
          const user = await cartService.getUserProduct(username, 0);
          const cartData = await cartService.getCart(username);
          const cart = cartData[0].cart;
          const subtotal = cartData[0].subtotal;

          if (!cart || cart.items.length === 0) {
              throw new Error('Cart is empty');
          }

          // Format cart items for PayPal
          const cartItems = await Promise.all(cart.items.map(async (item) => {
              const product = await Product.findById(item.productId);
              return {
                  productId: item.productId,
                  productName: product.productName,
                  productPrice: item.productPrice,
                  quantity: item.quantity
              };
          }));

          // Store shipping info in session or temporary storage
          // For now, we'll store it directly with the reservation
          await Reservation.updateMany(
              { userId: user._id, status: 'pending' },
              { 
                  $set: { 
                      shippingName: shippingInfo.name,
                      shippingAddress: shippingInfo.address
                  }
              }
          );

          // Create PayPal order
          const paypalOrder = await paypalService.createOrder(cartItems, subtotal, shippingInfo);

          return {
              success: true,
              paypalOrderId: paypalOrder.id,
              approvalUrl: paypalOrder.links.find(link => link.rel === 'approve').href
          };
      } catch (error) {
          console.error('Error creating PayPal order:', error);
          throw error;
      }
  }

  async processPayment(username, paypalOrderId) {
    try {
        // Get user info
        const user = await cartService.getUserProduct(username, 0);
        
        // Capture payment
        const captureResult = await paypalService.capturePayment(paypalOrderId);
        
        if (captureResult.status === 'COMPLETED') {
            // Payment successful, create order history
            const reservations = await Reservation.find({ userId: user._id, status: 'pending' });
            
            if (reservations.length === 0) {
                throw new Error('No pending reservations found');
            }
            
            // Get the shipping information from the reservations
            const shippingName = reservations[0].shippingName;
            const shippingAddress = reservations[0].shippingAddress;
            
            if (!shippingName || !shippingAddress) {
                throw new Error('Shipping information not found');
            }
            
            // Prepare product information for the order
            const orderProducts = await Promise.all(reservations.map(async (reservation) => {
                // Get the product for this reservation
                const product = await Product.findById(reservation.productId);
                
                // Convert reservation to order product
                return {
                    productId: reservation.productId,
                    productName: product.productName,
                    quantity: reservation.quantity,
                    price: product.productPrice
                };
            }));
            
            // Create new order
            const newOrder = new Order({
                orderId: uuidv4(), // Generate a unique order ID
                userId: user._id,
                Name: shippingName,
                ShippingAddress: shippingAddress,
                products: orderProducts.map(product => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    price: product.price,
                    status: false // Initially not received
                }))
            });
            
            // Save the order
            await newOrder.save();
            
            // Update product storage counts (decrease by reservation quantity)
            for (const reservation of reservations) {
                await Product.findByIdAndUpdate(
                    reservation.productId,
                    { 
                        $inc: { 
                            productStorage: -reservation.quantity,
                            productReservation: -reservation.quantity 
                        }
                    },
                    { new: true }
                );
            }
            
            // Update reservation status or delete reservations
            await Reservation.deleteMany({ userId: user._id, status: 'pending' });
            
            // Clear the cart
            await Cart.findOneAndDelete({ userId: user._id });
            
            // Send order confirmation email
            await emailService.sendOrderConfirmation(user.email, newOrder, orderProducts);
            
            return {
                success: true,
                message: 'Payment processed successfully',
                orderId: newOrder.orderId,
                paypalDetails: captureResult
            };
        } else {
            // Payment failed or incomplete
            throw new Error('Payment was not completed');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        
        // If there's an error, remove reservations and return stock
        try {
            await this.removeReservation(username);
        } catch (cleanupError) {
            console.error('Error cleaning up after payment failure:', cleanupError);
        }
        
        throw error;
    }
  }
}

module.exports = new CheckoutService;