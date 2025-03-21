const CartService = require('../services/CartService.js');

class CartController {
    async addToCart(req, res) {
        try {
            const { username, productId, quantity } = req.body;
            const result = await CartService.addToCart(username, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCart(req,res){
        try {
                const { username } = req.params;
                const cart = await CartService.getCart(username);
                res.status(200).json(cart);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
    }

    async removeFromCart(req, res) {
        try {
            const { userId, productId } = req.body;
            const result = await CartService.removeFromCart(userId, productId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const { username, productId, quantity } = req.body;
            const result = await CartService.updateCartItem(username, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new CartController();