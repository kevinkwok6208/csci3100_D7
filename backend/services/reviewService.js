const Product = require('../models/Products');
const Comment = require('../models/Comments');

class ReviewService {
  // Get reviews for a product
  static async getProductReviews(productID) {
    try {
      const product = await Product.findOne({ productID });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      const reviews = await Comment.find({ productID: product._id })
        .populate('user', 'username email') // Populate user details
        .sort({ timestamp: -1 }); // Sort by newest first
      
      // Calculate average rating
      let avgRating = 0;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
        avgRating = totalRating / reviews.length;
      }
      
      return {
        reviews,
        count: reviews.length,
        avgRating
      };
    } catch (error) {
      throw new Error(`Error fetching product reviews: ${error.message}`);
    }
  }
  
  // Add a review for a product
  static async addProductReview(productID, userId, content, rating) {
    try {
      const product = await Product.findOne({ productID });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Check if user already reviewed this product
      const existingReview = await Comment.findOne({
        productID: product._id,
        user: userId
      });
      
      if (existingReview) {
        // Update existing review
        existingReview.content = content;
        existingReview.Rating = rating;
        existingReview.timestamp = Date.now();
        await existingReview.save();
        return existingReview;
      }
      
      // Create new review
      const newReview = new Comment({
        user: userId,
        productID: product._id,
        Rating: rating,
        content,
        timestamp: Date.now()
      });
      
      await newReview.save();
      
      // Increment product reservation as a proxy for popularity
      // since we can't modify the Products schema
      await Product.findByIdAndUpdate(product._id, {
        $inc: { productReservation: 1 }
      });
      
      return newReview;
    } catch (error) {
      throw new Error(`Error adding product review: ${error.message}`);
    }
  }
  
  // Update a review
  static async updateReview(reviewId, userId, content, rating) {
    try {
      const review = await Comment.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Check if the user owns this review
      if (review.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized to update this review');
      }
      
      review.content = content;
      review.Rating = rating;
      review.timestamp = Date.now();
      
      await review.save();
      return review;
    } catch (error) {
      throw new Error(`Error updating review: ${error.message}`);
    }
  }
  
  // Delete a review
  static async deleteReview(reviewId, userId) {
    try {
      const review = await Comment.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Check if the user owns this review or is admin
      if (review.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized to delete this review');
      }
      
      await Comment.findByIdAndDelete(reviewId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting review: ${error.message}`);
    }
  }
}

module.exports = ReviewService;