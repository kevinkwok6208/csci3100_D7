const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  productStorage: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Product', productSchema);
