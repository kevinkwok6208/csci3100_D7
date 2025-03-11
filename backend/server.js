const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const connectDatabase = require('./config/connectDB');

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
    }

    startServer() {
        const PORT = process.env.PORT || 5001;
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}

new Server();
