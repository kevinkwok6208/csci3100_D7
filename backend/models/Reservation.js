const mongoose = require('mongoose');
const authService = require('../services/authService');

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  shippingName: {
    type: String,
    required: false
  },
  shippingAddress: {
      type: String,
      required: false
  },
  reservationDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'expired'],
    default: 'pending'
  }
});

// This will help link the reservation to the productReservation field in Products
ReservationSchema.post('save', async function(doc) {
  try {
    const Product = mongoose.model('Product');
    await Product.findByIdAndUpdate(
      doc.productId,
      { $inc: { productReservation: doc.quantity } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating product reservation count:', error);
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
