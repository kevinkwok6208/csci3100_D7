const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userProfileRoutes = require('./routes/userMan'); 
const adminUserRoutes = require('./routes/adminUser');
const productDisplayRoutes = require('./routes/productDisplay');
const connectDatabase = require('./config/connectDB');
const cartRoutes = require('./routes/cart');
const featureSeriveRoutes = require('./routes/feature');

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
    }

    startServer() {
        const PORT = process.env.PORT || 5001;
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}

new Server();