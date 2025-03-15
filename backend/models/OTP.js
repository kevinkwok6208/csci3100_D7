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
    },
    purpose: {
        type: String,
        enum: ['email_verification', 'password_UpdateOrReset'],
        required: true
    },
    newEmail: {
        type: String,
        required: function() {
            return this.purpose === 'email_change';
        }
    }
});

module.exports = mongoose.model('OTP', otpSchema);
