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
*/
router.get('/', searchController.searchProducts);

/*
  "http://localhost:5001/api/search/categories"
  "https://localhost:5443/api/search/categories"
  
  Function: Gets all available product categories
  Method: GET
*/
router.get('/categories', searchController.getAllCategories);

module.exports = router;