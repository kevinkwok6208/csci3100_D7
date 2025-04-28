const OrderHistory = require('../models/Order');

class OrderHistoryService {
    // Add to orderHistoryService.js
    async getOrdersByDateRange(startDate, endDate) {
        try {
            const orders = await OrderHistory.find({
                createdAt: { $gte: startDate, $lte: endDate }
            })
            .populate('products.productId')
            .populate('userId', 'username email');
            return orders;
        } catch (error) {
            throw new Error('Error fetching orders by date range: ' + error.message);
        }
    }

    async getAllOrders() {
        try {
            const orders = await OrderHistory.find({})
                .populate('products.productId')
                .populate('userId', 'username email'); // Populate user details
            return orders;
        } catch (error) {
            throw new Error('Error fetching all orders: ' + error.message);
        }
    }

    async getOrderHistoriesByUserId(userId) { //changed from userId to username
        try {
            const orders = await OrderHistory.find({ userId }).populate('products.productId'); // Populate product details
            return orders;
        } catch (error) {
            throw new Error('Error fetching order histories: ' + error.message);
        }
    }

    async getOrderById(orderId) {
        try {
            //const order = await OrderHistory.findById(orderId).populate('products.productId');
            const order = await OrderHistory.findOne({ orderId: orderId }).populate('products.productId');

            return order; // Should return the order object or null if not found
        } catch (error) {
            throw new Error('Error fetching order: ' + error.message);
        }
    }

    async getOrdersByStatus(userId, status) {
        try {
            const orders = await OrderHistory.find({ userId, 'products.status': status }).populate('products.productId');
            return orders; // Return orders matching the userId and status
        } catch (error) {
            throw new Error('Error fetching orders by status: ' + error.message);
        }
    }

    async updateOrderStatus(orderId) {
        try {
            // Find the order by ID
            //const order = await OrderHistory.findById(orderId);
            const order = await OrderHistory.findOne({ orderId: orderId });
            if (!order || order.status === true) {
                return null; // Return null if order doesn't exist or is already received
            }

            // Update the status to true (Received)
            order.products.forEach(product => {
                product.status = true; // Update each product's status
            });
            await order.save(); // Save the updated order

            return order; // Return the updated order
        } catch (error) {
            throw new Error('Error updating order status: ' + error.message);
        }
    }

    
}

module.exports = new OrderHistoryService(); 
