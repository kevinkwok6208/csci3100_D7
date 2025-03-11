const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('OTP', otpSchema);
