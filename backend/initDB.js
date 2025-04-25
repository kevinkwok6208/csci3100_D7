const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');
const bcrypt = require('bcryptjs');
const Product = require('./models/Products');
const Comment = require('./models/Comments');
const Category = require('./models/Category');
const fs = require('fs');
const path = require('path');
const connectDatabase = require('./config/connectDB');

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await connectDatabase();
        
        // Import categories from JSON file
        console.log('Importing categories...');
        const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json'), 'utf8'));
        
        // Check if categories already exist
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            // Insert categories
            for (const categoryItem of categoriesData) {
                await Category.create({
                    _id: categoryItem._id.$oid,
                    name: categoryItem.name,
                    description: categoryItem.description
                });
            }
            console.log(`${categoriesData.length} categories imported successfully`);
        } else {
            console.log('Categories already exist, skipping import');
        }
        
        // Import products from JSON file
        console.log('Importing products...');
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8'));
        
        // Check if products already exist
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            // Insert products
            for (const productItem of productsData) {
                await Product.create({
                    _id: productItem._id.$oid,
                    productID: productItem.productID,
                    productName: productItem.productName,
                    productPrice: productItem.productPrice,
                    productDescription: productItem.productDescription,
                    productImages: productItem.productImages,
                    productStorage: productItem.productStorage,
                    productReservation: productItem.productReservation,
                    featured: productItem.featured,
                    category: productItem.category.$oid
                });
            }
            console.log(`${productsData.length} products imported successfully`);
        } else {
            console.log('Products already exist, skipping import');
        }
        
        // Import users from JSON file
        console.log('Importing users...');
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/user.json'), 'utf8'));
        
        // Check if users already exist
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Insert users
            for (const userItem of usersData) {
                await User.create({
                    _id: userItem._id.$oid,
                    username: userItem.username,
                    hashedPassword: userItem.hashedPassword,
                    email: userItem.email,
                    isEmailVerified: userItem.isEmailVerified,
                    isadmin: userItem.isadmin
                });
            }
            console.log(`${usersData.length} users imported successfully`);
        } else {
            console.log('Users already exist, skipping import');
        }

        // Clear any existing OTPs
        await OTP.deleteMany({});
        console.log('Cleared existing OTPs');

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
                    Rating: 4,
                    timestamp: new Date("2023-03-15T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "Delivery was fast and the product works perfectly. Would recommend!",
                    Rating: 5,
                    timestamp: new Date("2023-03-13T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "Good value for money, but the packaging could be improved.",
                    Rating: 3,
                    timestamp: new Date("2023-03-10T10:30:00Z")
                },
                {
                    user: user._id,
                    productID: product._id,
                    content: "I've been using this for a week now and it's holding up well.",
                    Rating: 2,
                    timestamp: new Date("2023-03-08T10:30:00Z")
                }
            ];

            await Comment.insertMany(commentData);
            console.log('Sample comments created');
        } else {
            console.log('Could not create comments: User or product not found');
        }

        console.log('Database initialized successfully');

        process.exit(0);
        
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
