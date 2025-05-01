const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderHistoryController');
// Add to routes/orderHistory.js
/* 
    "http://localhost:5001/api/orderhistories/export-by-date"
    "https://localhost:5443/api/orderhistories/export-by-date"
    Query parameters: startDate, endDate
    Function: Export orders within date range as Excel file.
    Method: GET
*/
router.get('/export-by-date', orderHistoryController.exportOrdersByDateRange.bind(orderHistoryController));

/* 
    "http://localhost:5001/api/orderhistories/all"
    "https://localhost:5443/api/orderhistories/all"
    Function: Retrieve all orders for analytics.
    Method: GET
*/
router.get('/all', orderHistoryController.getAllOrders.bind(orderHistoryController));

/* 
    "http://localhost:5001/api/orderhistories/export"
    "https://localhost:5443/api/orderhistories/export"
    Function: Export all orders as Excel file.
    Method: GET
*/
router.get('/export', orderHistoryController.exportOrdersToExcel.bind(orderHistoryController));


// Order History Routes
/* 
    "http://localhost:5001/api/orderhistories/user/:userId"
    "https://localhost:5443/api/orderhistories/user/:userId"
    Parameters: {userId}
    Function: Retrieve all order histories for the specified user.
    Method: GET
*/
router.get('/user/:username', orderHistoryController.getOrderHistories.bind(orderHistoryController)); 

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