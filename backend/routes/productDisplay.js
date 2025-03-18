const express = require('express');
const router = express.Router();
const ProductDisplayController = require('../controllers/ProductDisplayController');
// Route to get all products
router.get('/get-allproducts', ProductDisplayController.getAllProducts);
router.get('/get-comments/:productId', ProductDisplayController.getCommentsForProduct);
router.get('/get-ratings/:productId', ProductDisplayController.getRatingsForProduct);
module.exports = router;