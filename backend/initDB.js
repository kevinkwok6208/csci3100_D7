const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');
const bcrypt = require('bcryptjs');
const Product = require('./models/Products');
const connectDatabase = require('./config/connectDB');

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Check if admin already exists to prevent duplicate creation
            // Create admin account
        let adminPassword;
        adminPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            hashedPassword: adminPassword,
            email: 'admin@example.com',
            isEmailVerified: true,
            isadmin: 1
        });
        console.log('Admin account created');
        

        let userPassword;
        // Check if test user already exists
            // Create test user account
        userPassword = await bcrypt.hash('user123', 10);
        await User.create({
            username: 'testuser',
            hashedPassword: userPassword,
            email: 'user@example.com',
            isEmailVerified: true,
            isadmin: 0
        });
        console.log('Test user account created');
        

        //Create Products

        userPassword = await bcrypt.hash('user123', 10);
        await User.create({
            username: 'testuser2',
            hashedPassword: userPassword,
            email: 'user2@example.com',
            isEmailVerified: false,
            isadmin: 0
        });
        console.log('Test user2 account created');
        


        // Clear any existing OTPs
        await OTP.deleteMany({});
        console.log('Cleared existing OTPs');

        // Clear any existing products
        await Product.create({
            productID: "P001",
            productName: "Smartphone X",
            productPrice: 799.99,
            productDescription: "Latest smartphone with 6.5-inch OLED display, 128GB storage, and triple camera system.",
            productImage: "smartphone_x.jpg",
            productStorage: 50
        },
        {
            productID: "P002",
            productName: "Laptop Pro",
            productPrice: 1299.99,
            productDescription: "High-performance laptop with 16GB RAM",
            productImage: "slaptop_pro",
            productStorage: 25 
        })

        console.log('Database initialized successfully with test accounts');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
