const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/* 
  "http://localhost:5001/api/search"
  "https://localhost:5443/api/search"
  Parameters (query parameters):
  - keyword: Search term
  - minPrice: Minimum price filter
  - maxPrice: Maximum price filter
  - category: Category filter
  - minRating: Minimum rating filter
  - sort: Sorting option (price_asc, price_desc, popularity, rating)
  
  Function: Searches products based on criteria
  Method: GET
  
  Examples:
  1. GET /api/search?keyword=phone
  2. GET /api/search?minPrice=100&maxPrice=500
  3. GET /api/search?category=electronics&sort=price_asc
  4. GET /api/search?minRating=4&sort=rating
*/
router.get('/', searchController.searchProducts);

module.exports = router;