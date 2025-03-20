const Cart = require('../models/Cart');
const Product = require('../models/Products');
const User = require('../models/User');
const authService = require('./authService');

class CartService {

    async getUserProduct(userId,productId){
        const user = await User.findOne({username:userId});
        if (!user) {
        throw new Error('User not found');
        }
        const product = await Product.findOne({productID:productId});
        if (!product) {
        throw new Error('Product not found');
        }

        return { user, product };
    }
    
    async addToCart(userId, productId, quantity) {
        try{
            const {user,product} = await this.getUserProduct(userId,productId);
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
    
}
module.exports = new CartService();