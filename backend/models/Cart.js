const mongoose = require('mongoose');

// Create the schema properly
const CartSchema = new mongoose.Schema({
  // _id is automatically added by Mongoose, no need to define it
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    productPrice: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
  }]
});



// Export the model
module.exports = mongoose.model('Cart', CartSchema);
