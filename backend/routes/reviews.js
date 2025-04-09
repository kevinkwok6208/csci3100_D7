const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

/* 
  "http://localhost:5001/api/reviews/products/:productID"
  "https://localhost:5443/api/reviews/products/:productID"
  Parameters: productID (in URL path)
  Function: Gets all reviews for a specific product
  Method: GET
*/
router.get('/products/:productID', reviewController.getProductReviews);

/* 
  "http://localhost:5001/api/reviews/products/:productID"
  "https://localhost:5443/api/reviews/products/:productID"
  Parameters: 
  - productID (in URL path)
  - {content, rating, username} (in request body)
  Function: Adds a review for a specific product
  Method: POST
  Authentication: Optional if username is provided
*/
router.post('/products/:productID', authenticateToken, reviewController.addProductReview);

// Add a new route for username-based review submission
router.post('/products/:productID/user', reviewController.addProductReview);

/* 
  "http://localhost:5001/api/reviews/:reviewId"
  "https://localhost:5443/api/reviews/:reviewId"
  Parameters: 
  - reviewId (in URL path)
  - {content, rating, username} (in request body)
  Function: Updates a specific review
  Method: PUT
  Authentication: Optional if username is provided
*/
router.put('/:reviewId', authenticateToken, reviewController.updateReview);

// Add a new route for username-based review update
router.put('/:reviewId/user', reviewController.updateReview);

/* 
  "http://localhost:5001/api/reviews/:reviewId"
  "https://localhost:5443/api/reviews/:reviewId"
  Parameters: reviewId (in URL path)
  Function: Deletes a specific review
  Method: DELETE
  Authentication: Optional if username is provided
*/
router.delete('/:reviewId', authenticateToken, reviewController.deleteReview);

// Add a new route for username-based review deletion
router.delete('/:reviewId/user', reviewController.deleteReview);

module.exports = router;