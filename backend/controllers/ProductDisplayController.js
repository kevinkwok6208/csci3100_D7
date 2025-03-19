const Product = require('../models/Products');
const ProductDisplayService = require('../services/ProductDisplayService');

class ProductDisplayController {
    async getAllProducts(req, res) {
        try {
            const products = await ProductDisplayService.getAllProducts();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getProductById(req, res) {
        try {
            const { productId } = req.params;
            const product = await ProductDisplayService.getProductById(productId);
            res.json(product);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getCommentsForProduct(req, res) {
        try {
            const { productId } = req.params;
            const comments = await ProductDisplayService.getCommentsForProduct(productId);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getRatingsForProduct(req, res) {
        try {
            const { productId } = req.params;
            const ratings = await ProductDisplayService.getRatingsForProduct(productId);
            res.json(ratings);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = new ProductDisplayController();