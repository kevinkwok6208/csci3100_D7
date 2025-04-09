const Product = require('../models/Products');
const Comment = require('../models/Comments');
const User = require('../models/User');

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
  
  // Find user by username or ID
  static async findUser(userId, username) {
    if (userId) {
      return userId; // Already have user ID
    }
    
    if (!username) {
      throw new Error('Either userId or username must be provided');
    }
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error(`User with username "${username}" not found`);
    }
    
    return user._id;
  }
  
  // Add a review for a product
  static async addProductReview(productID, userId, content, rating, username) {
    try {
      const product = await Product.findOne({ productID });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Resolve user ID from username if needed
      const resolvedUserId = await this.findUser(userId, username);
      
      // Check if user already reviewed this product
      const existingReview = await Comment.findOne({
        productID: product._id,
        user: resolvedUserId
      });
      
      if (existingReview) {
        // Update existing review
        existingReview.content = content;
        existingReview.Rating = rating;
        existingReview.timestamp = Date.now();
        await existingReview.save();
        
        // Populate user details before returning
        await existingReview.populate('user', 'username email');
        return existingReview;
      }
      
      // Create new review
      const newReview = new Comment({
        user: resolvedUserId,
        productID: product._id,
        Rating: rating,
        content,
        timestamp: Date.now()
      });
      
      await newReview.save();
      
      // Populate user details before returning
      await newReview.populate('user', 'username email');
      
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
  static async updateReview(reviewId, userId, content, rating, username) {
    try {
      const review = await Comment.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Resolve user ID from username if needed
      const resolvedUserId = await this.findUser(userId, username);
      
      // Check if the user owns this review
      if (review.user.toString() !== resolvedUserId.toString()) {
        throw new Error('Unauthorized to update this review');
      }
      
      review.content = content;
      review.Rating = rating;
      review.timestamp = Date.now();
      
      await review.save();
      
      // Populate user details before returning
      await review.populate('user', 'username email');
      return review;
    } catch (error) {
      throw new Error(`Error updating review: ${error.message}`);
    }
  }
  
  // Delete a review
  static async deleteReview(reviewId, userId, username) {
    try {
      const review = await Comment.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Resolve user ID from username if needed
      const resolvedUserId = await this.findUser(userId, username);
      
      // Check if the user owns this review
      if (review.user.toString() !== resolvedUserId.toString()) {
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