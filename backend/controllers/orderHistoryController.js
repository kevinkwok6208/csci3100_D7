// controllers/OrderHistoryController.js
const orderHistoryService = require('../services/orderHistoryService');
const User = require('../models/User');
const ExcelJS = require('exceljs'); // Add this import

class OrderHistoryController {
    // Add to orderHistoryController.js
    async exportOrdersByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            // Validate dates
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }
            
            // Convert to Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Set end date to end of day
            end.setHours(23, 59, 59, 999);
            
            // Get filtered orders
            const orders = await orderHistoryService.getOrdersByDateRange(start, end);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Filtered Orders');
            
            // Define columns
            worksheet.columns = [
                { header: 'Order ID', key: 'orderId', width: 20 },
                { header: 'User', key: 'username', width: 20 },
                { header: 'Customer Name', key: 'Name', width: 20 },
                { header: 'Shipping Address', key: 'ShippingAddress', width: 30 },
                { header: 'Total Price', key: 'totalPrice', width: 15 },
                { header: 'Order Date', key: 'createdAt', width: 20 },
                { header: 'Products', key: 'products', width: 50 }
            ];
            
            // Add rows
            orders.forEach(order => {
                const productsList = order.products.map(p => {
                    const productName = p.productId && p.productId.productName ? p.productId.productName : 'Unknown Product';
                    return `${productName} (${p.quantity} x $${p.price})`;
                }).join(', ');
                
                worksheet.addRow({
                    orderId: order.orderId,
                    username: order.username || (order.userId && order.userId.username) || 'Unknown',
                    Name: order.Name,
                    ShippingAddress: order.ShippingAddress,
                    totalPrice: `$${order.totalPrice.toFixed(2)}`,
                    createdAt: new Date(order.createdAt).toLocaleDateString(),
                    products: productsList
                });
            });
            
            // Format date range for filename
            const startFormatted = start.toISOString().split('T')[0];
            const endFormatted = end.toISOString().split('T')[0];
            
            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=orders-${startFormatted}-to-${endFormatted}.xlsx`);
            
            // Write to response
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Add these two new methods
    async getAllOrders(req, res) {
        try {
            const orders = await orderHistoryService.getAllOrders();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async exportOrdersToExcel(req, res) {
        try {
            const orders = await orderHistoryService.getAllOrders();
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('All Orders');
            
            // Define columns
            worksheet.columns = [
                { header: 'Order ID', key: 'orderId', width: 20 },
                { header: 'User', key: 'username', width: 20 },
                { header: 'Customer Name', key: 'Name', width: 20 },
                { header: 'Shipping Address', key: 'ShippingAddress', width: 30 },
                { header: 'Total Price', key: 'totalPrice', width: 15 },
                { header: 'Order Date', key: 'createdAt', width: 20 },
                { header: 'Products', key: 'products', width: 50 }
            ];
            
            // Add rows
            orders.forEach(order => {
                const productsList = order.products.map(p => {
                    const productName = p.productId && p.productId.productName ? p.productId.productName : 'Unknown Product';
                    return `${productName} (${p.quantity} x $${p.price})`;
                }).join(', ');
                
                worksheet.addRow({
                    orderId: order.orderId,
                    username: order.username || (order.userId && order.userId.username) || 'Unknown',
                    Name: order.Name,
                    ShippingAddress: order.ShippingAddress,
                    totalPrice: `$${order.totalPrice.toFixed(2)}`,
                    createdAt: new Date(order.createdAt).toLocaleDateString(),
                    products: productsList
                });
            });
            
            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=all-orders.xlsx');
            
            // Write to response
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Your existing methods
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