const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

/*  "http://localhost:5001/api/checkout/initiate-checkout/:username"
    "https://localhost:5443/api/checkout/initiate-checkout/:username"
    Parameters: NOne
    Function: Allow user to initiate checkout
    Method: Post
*/
router.post('/initiate-checkout/:username', checkoutController.initiateCheckout);

/*  "http://localhost:5001/api/checkout/cleanup-expired-reservations"
    "https://localhost:5443/api/checkout/cleanup-expired-reservations"
    Parameters: None
    Function: Remove the expired reservations fron DB regularly
    Method: Post
*/

router.post('/cleanup-expired-reservations', checkoutController.cleanupExpriedReservations);

/* "http://localhost:5001/api/checkout/remove-reservation/:username"
    "https://localhost:5443/api/checkout/remove-reservation/:username"
    Parameters: req.param{username}
    Function: Allow user to remove reservation
    Method: Post
*/
router.post('/remove-reservation/:username', checkoutController.removeReservation);


/*  "http://localhost:5001/api/checkout/create-paypal-order"
    "https://localhost:5443/api/checkout/create-paypal-order"
    Parameters: {username, shippingInfo}
    Function: Allow user to create paypal order
    Method: Post
*/
router.post('/create-paypal-order', checkoutController.createPayPalOrder);

/*  "http://localhost:5001/api/checkout/process-payment"
    "https://localhost:5443/api/checkout/process-payment"
    Parameters: {username, token}
    Function: if payment is successful, update the order status to paid,
    and remove the reservation from the database. Send the order confirmation 
    email to the user.
    Method: Post
*/
router.post('/process-payment', checkoutController.processPayment);
module.exports = router;

