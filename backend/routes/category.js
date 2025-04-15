const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public routes
/* "https://localhost:5443/api/categories"
    Parameters: None
    Function: Returns all categories from the database
    Method: GET
*/
router.get('/', categoryController.getAllCategories);

/* "http://localhost:5001/api/categories"
    Parameters: {name, description} (in request body)
    Function: Creates a new category in the database
    Method: POST
*/
router.post('/', categoryController.createCategory);

/* "http://localhost:5001/api/categories/:categoryName/products"
    Parameters: categoryName (in URL path)
    Function: Returns all products belonging to a specific category
    Method: GET
*/
router.get('/:categoryName/products', categoryController.getProductsByCategory);

module.exports = router;
