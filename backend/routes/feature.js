const express = require('express');
const router = express.Router();
const productController = require('../controllers/featureproduct');

// Product management routes
/* "http://localhost:5001/api/feature/set-featured"
    Parameters: {productId}
    Function: Set a product as featured.
    Method: Post
*/
router.post('/set-featured', async (req, res) => {
    const { productId } = req.body;
    const result = await productController.setFeaturedProduct(productId);
    res.json(result);
});

/* "http://localhost:5001/api/feature/change-featured"
    Parameters: {productId}
    Function: Allow sellers to change the featured product.
    Method: Post
*/
router.post('/change-featured', async (req, res) => {
    const { productId } = req.body;
    const result = await productController.changeFeaturedProduct(productId);
    res.json(result);
});

module.exports = router;