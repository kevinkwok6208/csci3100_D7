const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/add-to-cart', cartController.addToCart);

router.get('/get-cart/:username', cartController.getCart);

router.delete('/remove-from-cart', cartController.removeFromCart);

router.put('/update-cart', cartController.updateCart);

router.post('/initiate-checkout/:username', cartController.initiateCheckout);

router.post('/cleanup-expired-reservations', cartController.cleanupExpriedReservations);

router.post('/remove-reservation/:username', cartController.removeReservation);
module.exports = router;