const User = require('../models/User');
const OTP = require('../models/OTP');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth_info');
const Cookie = require('../models/Cookie');

class AuthService {
    async handleVerifyEmail(username, otpCode) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const now = new Date();
        now.setUTCHours(now.getUTCHours() + authConfig.timezone.adjustmentInHours);
        
        const otpRecord = await OTP.findOne({ 
            userId: user._id,
            purpose: 'email_verification',
            code: otpCode
        });
        
        if (!otpRecord || otpRecord.expiry < now) {
            throw new Error('Invalid or expired OTP');
        }

        await User.updateOne(
            { username },
            { isEmailVerified: true }
        );

        // Remove the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });
    }

    async handleForgotPassword(username) {
        const user = await User.findOne({ username });
        if (!user || !user.email || !user.isEmailVerified) {
            throw new Error('User not found or email not verified');
        }

        const otp = emailService.generateOTP();
        const otpExpiry = new Date(Date.now() + authConfig.otpExpiryMinutes * 60000);
        otpExpiry.setUTCHours(otpExpiry.getUTCHours() + authConfig.timezone.adjustmentInHours);

        // Save OTP for password reset
        await OTP.findOneAndUpdate(
            { userId: user._id },
            { 
                userId: user._id,
                username,
                code: otp,
                expiry: otpExpiry,
                purpose: 'password_reset'
            },
            { upsert: true, new: true }
        );

        await emailService.sendOTP(user.email, otp);
    }

    async handleResetPassword(username, otpCode, newPassword) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const now = new Date();
        now.setUTCHours(now.getUTCHours() + authConfig.timezone.adjustmentInHours);
        
        const otpRecord = await OTP.findOne({ 
            userId: user._id,
            purpose: 'password_reset',
            code: otpCode
        });
        
        if (!otpRecord || otpRecord.expiry < now) {
            throw new Error('Invalid or expired OTP');
        }

        const hashedPassword = await bcrypt.hash(newPassword, authConfig.saltRounds);
        await User.updateOne(
            { username },
            { hashedPassword: hashedPassword }
        );

        // Remove the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });
    }

    async handleResendOTP(username) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const otp = emailService.generateOTP();
        const otpExpiry = new Date(Date.now() + authConfig.otpExpiryMinutes * 60000);
        otpExpiry.setUTCHours(otpExpiry.getUTCHours() + authConfig.timezone.adjustmentInHours);

        // Determine purpose based on email verification status
        const purpose = user.isEmailVerified ? 'password_reset' : 'email_verification';
        
        // Save new OTP without purpose distinction
        await OTP.findOneAndUpdate(
            { userId: user._id },
            { 
                userId: user._id,
                username,
                code: otp,
                expiry: otpExpiry,
                purpose
            },
            { upsert: true, new: true }
        );

        await emailService.sendOTP(user.email, otp);
    }

    async validateToken(token) {
        const cookieEntry = await Cookie.findOne({ token });
        
        if (!cookieEntry || cookieEntry.expires < new Date()) {
            return null;
        }
        
        return cookieEntry;
    }
    
    async invalidateAllUserTokens(userId) {
        await Cookie.deleteMany({ userId });
    }
}

module.exports = new AuthService();
