const Product = require('../models/Products');

class ProductDisplayService {
    async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (err) {
            console.error('Error fetching products:', err);
            throw err;
        }
    }
}
module.exports = new ProductDisplayService();