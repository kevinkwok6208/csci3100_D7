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
  - {content, rating} (in request body)
  Function: Adds a review for a specific product
  Method: POST
  Authentication: Required (Bearer token)
*/
router.post('/products/:productID', authenticateToken, reviewController.addProductReview);

/* 
  "http://localhost:5001/api/reviews/:reviewId"
  "https://localhost:5443/api/reviews/:reviewId"
  Parameters: 
  - reviewId (in URL path)
  - {content, rating} (in request body)
  Function: Updates a specific review
  Method: PUT
  Authentication: Required (Bearer token)
*/
router.put('/:reviewId', authenticateToken, reviewController.updateReview);

/* 
  "http://localhost:5001/api/reviews/:reviewId"
  "https://localhost:5443/api/reviews/:reviewId"
  Parameters: reviewId (in URL path)
  Function: Deletes a specific review
  Method: DELETE
  Authentication: Required (Bearer token)
*/
router.delete('/:reviewId', authenticateToken, reviewController.deleteReview);

module.exports = router;