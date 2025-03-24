const ReviewService = require('../services/reviewService');

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productID } = req.params;
    const result = await ReviewService.getProductReviews(productID);
    
    res.status(200).json({
      success: true,
      count: result.count,
      avgRating: result.avgRating,
      reviews: result.reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product reviews',
      error: error.message
    });
  }
};

// Add a review for a product
exports.addProductReview = async (req, res) => {
  try {
    const { productID } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;
    
    if (!content || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Review content and rating are required'
      });
    }
    
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }
    
    const review = await ReviewService.addProductReview(
      productID,
      userId,
      content,
      rating
    );
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;
    
    if (!content || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Review content and rating are required'
      });
    }
    
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }
    
    const review = await ReviewService.updateReview(
      reviewId,
      userId,
      content,
      rating
    );
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    const result = await ReviewService.deleteReview(reviewId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};