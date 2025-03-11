/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const authService = require('../services/authService.js');
const authConfig = require('../config/auth_info.js');
const Cookie = require('../models/Cookie');


class AuthController {
    async login(req, res) {
        const { username, password } = req.body;
        try {
            // Find user by username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Verify password match
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check if email is verified (required for login)
            if (!user.isEmailVerified) {
                return res.status(403).json({ 
                    message: 'Email verification required',
                    requiresVerification: true,
                    username: user.username
                });
            }

            // Generate JWT token with user information
            const token = jwt.sign(
                { userId: user._id, username, isadmin: user.isadmin },
                authConfig.jwtSecret,
                { expiresIn: authConfig.jwtExpiresIn }
            );

            // Calculate token expiry date based on JWT expiration time
            const expiryTimeInSeconds = typeof authConfig.jwtExpiresIn === 'string'
            ? (authConfig.jwtExpiresIn.endsWith('h')
                ? parseInt(authConfig.jwtExpiresIn) * 3600
                : authConfig.jwtExpiresIn.endsWith('m')
                    ? parseInt(authConfig.jwtExpiresIn) * 60
                    : parseInt(authConfig.jwtExpiresIn))
            : authConfig.jwtExpiresIn;

            const expiryDate = new Date(Date.now() + expiryTimeInSeconds * 1000);
            // Adjust for Hong Kong timezone
            expiryDate.setUTCHours(expiryDate.getUTCHours() + authConfig.timezone.adjustmentInHours);

            // Save token to Cookie collection
            await Cookie.findOneAndUpdate(
                { userId: user._id },
                { 
                    userId: user._id,
                    username: user.username,
                    token: token,
                    expires: expiryDate
                },
                { upsert: true, new: true }
            );

            // Return authentication data to client
            res.json({ token, isadmin: user.isadmin, username });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async register(req, res) {
        const { username, password, email } = req.body;
        try {
            const existingUser = await User.findOne({ 
                username: username, 
              });              
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);
            const user = new User({
                username,
                hashedPassword: hashedPassword,
                email,
                isadmin: 0,
                isEmailVerified: false
            });

            await user.save();
            await authService.handleResendOTP(username);
            res.status(201).json({ 
                message: 'Registration successful. Please verify your email.',
                username 
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async authByCookie(req, res) {
        try {
            const { token } = req.body;
            
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            
            // Find the cookie entry in database
            const cookieEntry = await Cookie.findOne({ token });
            
            if (!cookieEntry) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
            
            // convert the currentTime to Hong Kong timezone
            const currentTime = new Date();
            const adjustedCurrentTime = new Date(currentTime);
            adjustedCurrentTime.setUTCHours(currentTime.getUTCHours() + authConfig.timezone.adjustmentInHours);

            // Check if token has expired
            // Current code will delete non-expired tokens and consider them expired
            if (cookieEntry.expires < adjustedCurrentTime) {
                await Cookie.deleteOne({ _id: cookieEntry._id });
                return res.status(401).json({ message: 'Token has expired' });
            }
            
            // Get user data
            const user = await User.findOne({ _id: cookieEntry.userId });
            
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            res.json({ 
                token, 
                isadmin: user.isadmin, 
                username: user.username,
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    // Add logout method
    async logout(req, res) {
        try {
            const { token } = req.body;
            
            if (token) {
                await Cookie.deleteOne({ token });
            }
            
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async verifyEmail(req, res) {
        try {
            await authService.handleVerifyEmail(req.body.username, req.body.otp);
            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            await authService.handleForgotPassword(req.body.username);
            res.json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            await authService.handleResetPassword(
                req.body.username, 
                req.body.otp, 
                req.body.newPassword
            );
            res.json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async resendOTP(req, res) {
        try {
            await authService.handleResendOTP(req.body.username);
            res.json({ message: 'New OTP sent successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
