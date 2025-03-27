const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderHistoryController');

// Order History Routes
/* 
    "http://localhost:5001/api/orderhistories/user/:userId"
    "https://localhost:5443/api/orderhistories/user/:userId"
    Parameters: {userId}
    Function: Retrieve all order histories for the specified user.
    Method: GET
*/
router.get('/user/:userId', orderHistoryController.getOrderHistories.bind(orderHistoryController)); 

/* 
    "http://localhost:5001/api/orderhistories/order/:orderId"
    "https://localhost:5443/api/orderhistories/order/:orderId"
    Parameters: {orderId}
    Function: Retrieve order history for the specified order ID.
    Method: GET
*/
router.get('/order/:orderId', orderHistoryController.getOrderById.bind(orderHistoryController)); 

/* 
    "http://localhost:5001/api/orderhistories/order/:orderId/status"
    "https://localhost:5443/api/orderhistories/order/:orderId/status"
    Parameters: {orderId}
    Function: Update the status of the specified order.
    Method: PATCH
*/
router.patch('/order/:orderId/status', orderHistoryController.updateOrderStatus.bind(orderHistoryController));
/* 
    "http://localhost:5001/api/orderhistories/user/:userId/status/:status"
    "https://localhost:5443/api/orderhistories/user/:userId/status/:status"
    Parameters: {userId, status}
    Function: Filter order history by order status.
    Method: GET
*/
router.get('/user/:userId/status/:status', orderHistoryController.getOrdersByStatus.bind(orderHistoryController));  
module.exports = router;