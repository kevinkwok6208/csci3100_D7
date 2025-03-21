const express = require('express');
const router = express.Router();
const ProductDisplayController = require('../controllers/ProductDisplayController');
// Route to get all products
/*  "http://localhost:5001/api/product-display/get-allproducts"
    "https://localhost:5443/api/product-display/get-allproducts"
    Parameters: None
    Function: Display all the products.
    Method: Get
*/
router.get('/get-allproducts', ProductDisplayController.getAllProducts);

/*  "http://localhost:5001/api/product-display/get-products"
    "https://localhost:5443/api/product-display/get-products"
    Parameters: req.params.productId
    Function: Display all the products.
    Method: Get
*/
router.get('/get-products/:productId', ProductDisplayController.getProductById);

/*  "http://localhost:5001/api/admin/get-comments/{productId}"
    "https://localhost:5443/api/admin/get-comments/{productId}"
    Parameters: req.params.productId
    Function: Allow user to view comments for a product.
    Method: Get
*/
router.get('/get-comments/:productId', ProductDisplayController.getCommentsForProduct);

/*  "http://localhost:5001/api/admin/get-ratings/{productId}"
    "https://localhost:5443/api/admin/get-ratings/{productId}"
    Parameters: req.params.productId
    Function: Allow user to view ratings for a product.
    Method: Get
*/
router.get('/get-ratings/:productId', ProductDisplayController.getRatingsForProduct);
module.exports = router;