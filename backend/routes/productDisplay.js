const express = require('express');
const router = express.Router();
const ProductDisplayController = require('../controllers/ProductDisplayController');
// Route to get all products
router.get('/get-allproducts', ProductDisplayController.getAllProducts);

module.exports = router;