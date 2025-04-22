const Cart = require('../models/Cart');
const Product = require('../models/Products');
const User = require('../models/User');

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
            if (quantity > product.productStorage - product.productReservation) {
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
                    if (cart.items[existingItemIndex].quantity > product.productStorage-product.productReservation) {
                        throw new Error('Quantity exceeds available stock');
                    }
                  } else { 
                // Add the product to the cart if it's not already in it
                cart.items.push({
                    productId: product._id,
                    productPrice: product.productPrice*quantity,
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
        const cart = await Cart.findOne({ userId: user._id }).populate('items.productId','productName productID productPrice');
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
        // Get the user and product
        const { user, product } = await this.getUserProduct(username, productId);
        const cart = await Cart.findOne({ userId: user._id });
        //  Check if the product is in the cart
        if (!cart) {
          throw new Error('Cart not found');
        }
        // Find the index of the product in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());
        // If the product is not in the cart, throw an error
        if (itemIndex === -1) {
          throw new Error('Product not found in cart');
        }
        
        cart.items.splice(itemIndex, 1);
        
        await cart.save();
        // Return the updated cart
        const populatedCart = await Cart.findOne({ userId: user._id }).populate('items.productId', 'productName productID');
        
        return populatedCart;
      }
          
    async updateCartItem(username, productId, quantity) {
        // 1. Get user and product in one operation if possible
        const { user, product } = await this.getUserProduct(username, productId);
        
        // 2. Validate quantity against stock before database operations
        if (quantity > product.productStorage) {
          throw new Error('Quantity exceeds available stock');
        }
        
        // 3. Use findOneAndUpdate to update the cart in a single operation
        const updatedCart = await Cart.findOneAndUpdate(
          { 
            userId: user._id, 
            'items.productId': product._id  // Find the specific item in the cart
          },
          { 
            $set: { 
              'items.$.quantity': quantity,
              'items.$.productPrice': product.productPrice * quantity 
            } 
          },
          { 
            new: true,  // Return the updated document
            runValidators: true  // Run validators on update
          }
        );
        
        if (!updatedCart) {
          throw new Error('Cart or product not found');
        }
        
        // 4. Populate in the same operation if needed
        const populatedCart = await updatedCart.populate('items.productId', 'productName productID');
        
        return populatedCart;
      }

}
module.exports = new CartService();