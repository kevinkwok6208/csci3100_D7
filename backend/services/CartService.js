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

}
module.exports = new CartService();