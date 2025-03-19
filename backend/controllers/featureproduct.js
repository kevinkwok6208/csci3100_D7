/**
 * Product Controller
 * Handles product management for sellers
 */
const Product = require('../models/Products');

class ProductController {
    async updateFeaturedStatus(productId) {
        // Update the featured status of all products
        await Product.updateMany({}, { featured: false });

        // Set the selected product as featured
        const product = await Product.findOne({ productID: productId });
        if (product) {
            product.featured = true;
            await product.save();
            return { message: `Featured product set to: ${product.productName}` };
        }
        return { message: 'Product not found in the database' };
    }

    async setFeaturedProduct(productId) {
        try {
            return await this.updateFeaturedStatus(productId);
        } catch (error) {
            console.error('Error setting featured product:', error);
            return { message: 'Server error' };
        }
    }

    async changeFeaturedProduct(productId) {
        try {
            return await this.updateFeaturedStatus(productId);
        } catch (error) {
            console.error('Error changing featured product:', error);
            return { message: 'Server error' };
        }
    }
}

module.exports = new ProductController();