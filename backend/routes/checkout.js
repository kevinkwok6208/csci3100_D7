const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/initiate-checkout/:username', checkoutController.initiateCheckout);

router.post('/cleanup-expired-reservations', checkoutController.cleanupExpriedReservations);

router.post('/remove-reservation/:username', checkoutController.removeReservation);

module.exports = router;

