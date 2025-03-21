const express = require('express');
const cors = require('cors');
const https = require('https'); // Add this import
const fs = require('fs'); // Add this import
const path = require('path'); // Add this import
const authRoutes = require('./routes/auth');
const userProfileRoutes = require('./routes/userMan'); 
const adminUserRoutes = require('./routes/adminUser');
const productDisplayRoutes = require('./routes/productDisplay');
const connectDatabase = require('./config/connectDB');
const cartRoutes = require('./routes/cart');
const featureSeriveRoutes = require('./routes/feature');
const checkoutRoutes = require('./routes/checkout');
const checkoutService = require('./services/checkoutService');
const productRoutes = require('./routes/product.js');

class Server {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.connectDatabase();
        this.setupRoutes();
        this.startServer();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    connectDatabase() {
        // Now we just call the imported function
        connectDatabase();
    }

    setupRoutes() {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/admin-user', adminUserRoutes);
        this.app.use('/api/user-manage', userProfileRoutes);
        this.app.use('/api/product-display', productDisplayRoutes);
        this.app.use('/api/feature', featureSeriveRoutes);
        this.app.use('/api/cart', cartRoutes);
        this.app.use('/api/checkout', checkoutRoutes);
        this.app.use('/api/products', productRoutes); // Add product routes
    }

    startServer() {
        const PORT = process.env.PORT || 5001;
        const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

        // Start HTTP server (optional, can be removed if you only want HTTPS)
        this.app.listen(PORT, () => {
            console.log(`HTTP Server running on port ${PORT}`);
        });
        
        try {
            // SSL certificate options - adjust paths as needed
            const options = {
                key: fs.readFileSync(path.join('./ssl/key.pem')),
                cert: fs.readFileSync(path.join('./ssl/cert.pem')),
            };
            
            // Create HTTPS server
            https.createServer(options, this.app).listen(HTTPS_PORT, () => {
                console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
            });
        } catch (error) {
            console.error('Failed to start HTTPS server:', error.message);
            console.log('Continuing with HTTP only...');
        }

        setInterval(async () => {
            try {
                const result = await checkoutService.cleanupExpiredReservations();
                console.log('Reservation cleanup result:', result);
            } catch (error) {
                console.error('Error during reservation cleanup:', error);
            }
        }, 60000);
    }
}

new Server();
