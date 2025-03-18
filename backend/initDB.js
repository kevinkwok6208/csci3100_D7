const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');
const bcrypt = require('bcryptjs');
const Product = require('./models/Products');
const Comment = require('./models/Comments');
const Rating = require('./models/Ratings');
const connectDatabase = require('./config/connectDB');

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await connectDatabase();
        
        // Check if admin already exists
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            // Create admin account
            let adminPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                hashedPassword: adminPassword,
                email: 'admin@example.com',
                isEmailVerified: true,
                isadmin: 1
            });
            console.log('Admin account created');
        } else {
            console.log('Admin account already exists, skipping creation');
        }

        // Check if test user already exists
        const userExists = await User.findOne({ username: 'testuser' });
        if (!userExists) {
            // Create test user account
            let userPassword = await bcrypt.hash('user123', 10);
            await User.create({
                username: 'testuser',
                hashedPassword: userPassword,
                email: 'user@example.com',
                isEmailVerified: true,
                isadmin: 0
            });
            console.log('Test user account created');
        } else {
            console.log('Test user account already exists, skipping creation');
        }

        // Check if test user2 already exists
        const user2Exists = await User.findOne({ username: 'testuser2' });
        if (!user2Exists) {
            let userPassword = await bcrypt.hash('user123', 10);
            await User.create({
                username: 'testuser2',
                hashedPassword: userPassword,
                email: 'user2@example.com',
                isEmailVerified: false,
                isadmin: 0
            });
            console.log('Test user2 account created');
        } else {
            console.log('Test user2 account already exists, skipping creation');
        }

        // Clear any existing OTPs
        await OTP.deleteMany({});
        console.log('Cleared existing OTPs');

        // Check if products exist
        const product1Exists = await Product.findOne({ productID: "P001" });
        const product2Exists = await Product.findOne({ productID: "P002" });
        
        if (!product1Exists) {
            await Product.create({
                productID: "P001",
                productName: "Smartphone X",
                productPrice: 799.99,
                productDescription: "Latest smartphone with 6.5-inch OLED display, 128GB storage, and triple camera system.",
                productImage: "smartphone_x.jpg",
                productStorage: 50
            });
            console.log('Product P001 created');
        }
        
        if (!product2Exists) {
            await Product.create({
                productID: "P002",
                productName: "Laptop Pro",
                productPrice: 1299.99,
                productDescription: "High-performance laptop with 16GB RAM",
                productImage: "slaptop_pro",
                productStorage: 25 
            });
            console.log('Product P002 created');
        }

        // Initialize comments
        // First clear existing comments
        await Comment.deleteMany({});
        console.log('Cleared existing comments');

        // Get actual user and product IDs from the database
        const user = await User.findOne({ username: 'admin' });
        const product = await Product.findOne({ productID: "P001" });

        if (user && product) {
            // Add sample comments
            const commentData = [
                {
                    user: user._id,
                    productID: product._id,
                    content: "This product exceeded my expectations! The quality is outstanding.",
                    timestamp: new Date("2023-03-15T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "Delivery was fast and the product works perfectly. Would recommend!",
                    timestamp: new Date("2023-03-13T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "Good value for money, but the packaging could be improved.",
                    timestamp: new Date("2023-03-10T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "I've been using this for a week now and it's holding up well.",
                    timestamp: new Date("2023-03-08T10:30:00Z")
                }
            ];

            await Comment.insertMany(commentData);
            console.log('Sample comments created');
        } else {
            console.log('Could not create comments: User or product not found');
        }

        console.log('Database initialized successfully');

        //initialize rating data
        await Rating.deleteMany({});
        const ratinguuser1=await User.findOne({ username: 'testuser' });
        const ratinguuser2=await User.findOne({ username: 'testuser2' });
        const productrating1 = await Product.findOne({ productID: "P001" });
        const productrating2 = await Product.findOne({ productID: "P002" });
        const ratingData = [
            {
                user: ratinguuser1._id,
                productID: productrating1._id,
                Rating :4
            },
            {
                user: ratinguuser1._id,
                productID: productrating2._id,
                Rating :4
            },
            {
                user: ratinguuser2._id,
                productID: productrating2._id,
                Rating :4
            },
            {
                user: ratinguuser2._id,
                productID: productrating1._id,
                Rating :5
            }
        ];
        await Rating.insertMany(ratingData);
        console.log('Sample ratings created');
        process.exit(0);
        
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
