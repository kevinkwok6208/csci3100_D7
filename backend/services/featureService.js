const Product = require('../models/Products');
// const AuthService = require('../services/authService');

class ProductController {
    /* Function to set a product as featured */
    async setFeaturedProduct(productId) {
        try {
            const product = await Product.findOne({ productID: productId });

            if (!product) {
                return { message: 'Product not found in the database' };
            }

            await Product.updateMany({}, { featured: false });

            product.featured = true;
            await product.save();

            // Call AuthService to validate token
            // const token = 'sample_token'; // Replace with actual token
            // const cookieEntry = await AuthService.validateToken(token);

            return { 
                message: `Featured product set to: ${product.productName}`,
                cookieEntry: cookieEntry
            };
        } catch (error) {
            console.error('Error setting featured product:', error);
            return { message: 'Server error' };
        }
    }

    // Other functions in the ProductController...
}

module.exports = new ProductController();