const CartService = require('../services/CartService');
const Cart = require('../models/Cart');
const Product = require('../models/Products');
const User = require('../models/User');
const authService = require('../services/authService');

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            const result = await CartService.addToCart(userId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new CartController();