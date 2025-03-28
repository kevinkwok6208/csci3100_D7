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
  productImages: {
    type: [String],
    required: true,
    default: []
  },
  productStorage: {
    type: Number,
    required: true
  },
  productReservation:{
    type: Number,
    required: true,
    default :0
  },
  featured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Product', productSchema);
