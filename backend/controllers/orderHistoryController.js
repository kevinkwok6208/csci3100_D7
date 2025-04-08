// controllers/OrderHistoryController.js
const orderHistoryService = require('../services/orderHistoryService');
const User = require('../models/User');
class OrderHistoryController {
    async getOrderHistories(req, res) {
        const username = req.params.username; // Changed from userId to username
        console.log('Requested username:', username); // Debugging statement
        try {

            const user = await User.findOne({username}); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user._id; // Get the userId from the user document
        console.log('Found userId:', userId); // Debugging statement

        const orders = await orderHistoryService.getOrderHistoriesByUserId(userId);
        console.log('Orders retrieved:', orders); // Debugging statement
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getOrderById(req, res) {
        const orderId = req.params.orderId; // Get orderId from route parameters
        try {
            const order = await orderHistoryService.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found.' });
            }
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateOrderStatus(req, res) {
        const orderId = req.params.orderId; // Get orderId from route parameters
        try {
            const updatedOrder = await orderHistoryService.updateOrderStatus(orderId);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found or already received.' });
            }
            return res.status(200).json(updatedOrder);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getOrdersByStatus(req, res) {
        const userId = req.params.userId;
        const status = req.params.status === 'true'; // Convert status to boolean
        try {
            const orders = await orderHistoryService.getOrdersByStatus(userId, status);
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new OrderHistoryController(); 