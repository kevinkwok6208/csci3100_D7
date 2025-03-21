// controllers/OrderHistoryController.js
const orderHistoryService = require('../services/orderHistoryService');

class OrderHistoryController {
    async getOrderHistories(req, res) {
        const userId = req.params.userId; // Assuming userId is passed as a route parameter
        console.log('Requested userId:', userId); // Debugging statement
        try {
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