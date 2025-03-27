const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

//Add to cart function
/*  "http://localhost:5001/api/cart/add-to-cart"
    "https://localhost:5443/api/cart/add-to-cart"
    Parameters: {username, productId, quantity}
    Function: Allow user add product to cart
    Method: Post
*/
router.post('/add-to-cart', cartController.addToCart);

/*  "http://localhost:5001/api/cart/get-cart/:username"
    "https://localhost:5443/api/cart/get-cart/:username"
    Parameters: req.param{username}
    Function: Fetch the procducts in cart
    Method: Get
*/
router.get('/get-cart/:username', cartController.getCart);

/*  "http://localhost:5001/api/cart/remove-from-cart/:username"
    "https://localhost:5443/api/cart/remove-from-cart:/username"
    Parameters: req.params{username},{productId}
    Function: Allow user remove product from cart
    Method: delete
*/
router.delete('/remove-from-cart/:username', cartController.removeFromCart);

/*  "http://localhost:5001/api/cart/update-cart/:username"
    "https://localhost:5443/api/cart/update-cart:/username"
    Parameters: req.params{username},{productId, quantity }
    Function: Allow user update product quantity from cart
    Method: delete
*/
router.put('/update-cart/:username', cartController.updateCart);

module.exports = router;