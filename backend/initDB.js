const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');
const bcrypt = require('bcryptjs');
const connectDatabase = require('./config/connectDB');

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Check if admin already exists to prevent duplicate creation
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            // Create admin account
            const adminPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                hashedPassword: adminPassword,
                email: 'admin@example.com',
                isEmailVerified: true,
                isadmin: 1
            });
            console.log('Admin account created');
        }

        // Check if test user already exists
        const userExists = await User.findOne({ username: 'testuser' });
        if (!userExists) {
            // Create test user account
            const userPassword = await bcrypt.hash('user123', 10);
            await User.create({
                username: 'testuser',
                hashedPassword: userPassword,
                email: 'user@example.com',
                isEmailVerified: true,
                isadmin: 0
            });
            console.log('Test user account created');
        }

        // Check if test user2 already exists
        const user2Exists = await User.findOne({ username: 'testuser2' });
        if (!user2Exists) {
            // Create test user2 account (not verified)
            const userPassword = await bcrypt.hash('user123', 10);
            await User.create({
                username: 'testuser2',
                hashedPassword: userPassword,
                email: 'user2@example.com',
                isEmailVerified: false,
                isadmin: 0
            });
            console.log('Test user2 account created');
        }

        // Clear any existing OTPs
        await OTP.deleteMany({});
        console.log('Cleared existing OTPs');

        console.log('Database initialized successfully with test accounts');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
