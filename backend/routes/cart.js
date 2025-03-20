const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/add-to-cart', cartController.addToCart);

router.get('/get-cart/:username', cartController.getCart);

router.delete('/remove-from-cart', cartController.removeFromCart);

router.put('/update-cart', cartController.updateCart);
module.exports = router;