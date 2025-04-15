const Product = require('../models/Products');
const Comment = require('../models/Comments');
class ProductDisplayService {
    async getAllProducts() {
        try {
            const products = await Product.find().populate('category');
            return products;
        } catch (err) {
            console.error('Error fetching products:', err);
            throw err;
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findOne({productID:productId}).populate('category');
            if (!product) {
                throw new Error('Product not found');
            }
            const productobj=product.toObject();
            productobj.availableStock = product.productStorage - product.productReservation;
            return productobj;
        } catch (err) {
            console.error('Error fetching product:', err);
            throw err;
        }
    }
    async getObjectidFromProductID(productId) {
        try {
            const product = await Product.findOne({ productID: productId });
            if (!product) {
                throw new Error('Product not found');
            }
            const retrived_productID=product._id;
            return retrived_productID;
        } catch (err) {
            console.error('Error fetching product:', err);
            throw err;
        }
    }

    async getCommentsForProduct(productId) {
        try {
            const retrived_productID = await this.getObjectidFromProductID(productId);
            const comments = await Comment.find({ productID: retrived_productID}).populate('user', 'username');
            const formattedComments = comments.map(comment => ({
                user: comment.user.username,
                content: comment.content,
                timestamp: comment.timestamp
            }));

            if (formattedComments.length === 0) {
                const message="No comments found for this product.";
                return message;
            }
            return formattedComments;
        } catch (err) {
            console.error('Error fetching comments:', err);
            throw err;
        }
    }

    async getRatingsForProduct(productId) {
        try {
            // Get the product by ID in Products collection
            const retrived_productID = await this.getObjectidFromProductID(productId);
            const ratings=await Comment.find({ productID: retrived_productID});

            // Filter out ratings with null values
            const validRatings = ratings.filter(rating => rating.Rating !== 0);
            if  (validRatings.length === 0) {
                const message="No ratings found for this product.";
                return message;
            }
            // Calculate average rating
            const totalRatings = validRatings.length;
            const averageRating = totalRatings > 0 ? validRatings.reduce((sum, rating) => sum + rating.Rating, 0) / totalRatings : 0;

            return {
                productID: productId,
                averageRating: averageRating
            };

        }catch (err) {
            console.error('Error fetching ratings:', err);
            throw err;
        }
    }
}
module.exports = new ProductDisplayService();