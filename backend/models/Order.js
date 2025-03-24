const mongoose = require('mongoose');

// Product Detail Schema
const ProductDetailSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        required: true,
        ref: 'Product' // Ensure this matches your Product model name
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Minimum quantity must be 1
    },
    price: { // Store the price at the time of the order
        type: Number,
        // Make the price optional; it will be set in middleware
    },
    status: {
        type: Boolean,
        required: true // True if the product has been received, false if still being sent
    }
}, { _id: false });

// Order History Schema
const OrderHistorySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'User'
    },
    products: [ProductDetailSchema], // Include products array
    Name: {
        type: String,
        required: true
    },
    ShippingAddress: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now // Default to current date; can be modified if needed
    }
});

// Pre-save middleware to calculate total price and store item prices
OrderHistorySchema.pre('save', async function(next) {
    const Product = mongoose.model('Product'); // Ensure you have your Product model loaded
    
    try {
        const productDetails = await Promise.all(this.products.map(async (product) => {
            const foundProduct = await Product.findById(product.productId);
            if (foundProduct) {
                // Automatically set the price from the referenced product
                product.price = foundProduct.productPrice; // Store price at the time of order
                console.log(`Product ID: ${product.productId}, Price: ${product.price}, Quantity: ${product.quantity}`);
                return foundProduct.productPrice * product.quantity; // Calculate total for this product
            }
            console.log(`Product with ID ${product.productId} not found.`);
            return 0; // If product not found, return 0
        }));

        this.totalPrice = productDetails.reduce((total, price) => total + price, 0);
        console.log(`Calculated Total Price: ${this.totalPrice}`); // Log the total price
        
        if (this.totalPrice <= 0) {
            console.log("Error: Total price is zero or negative.");
            return next(new Error('Total price must be greater than zero.'));
        }

        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error);
        next(error); // Pass any errors to the next middleware
    }
});

// Export the model
module.exports = mongoose.model('Order', OrderHistorySchema);