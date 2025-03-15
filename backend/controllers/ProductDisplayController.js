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
}
module.exports = new ProductDisplayController();