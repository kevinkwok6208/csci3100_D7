/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */
const authService = require('../services/authService.js');
const Cookie = require('../models/Cookie');


class AuthController {
    /* Login function */
    async login(req, res) {
        const { UsernameOrEmail, password } = req.body;
        try {
            const result = await authService.handleLogin(UsernameOrEmail, password);
            res.json(result);
        } catch (error) {
            if (error.message === 'INVALID_CREDENTIALS') {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else if (error.message === 'EMAIL_NOT_VERIFIED') {
                return res.status(403).json({
                    message: 'Email verification required',
                    requiresVerification: true,
                    username
                });
            } else {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }

    /* Register function to be export as route*/ 
    async register(req, res) {
        const { username, password, email } = req.body;
        try {
            const result = await authService.handleRegister(username, password, email);
            res.status(201).json({ 
                message: 'Registration successful. Please verify your email.',
                username: result.username 
            });
        } catch (error) {
            if (error.message === 'USERNAME_EXISTS') {
                return res.status(400).json({ message: 'Username already exists' });
            } else {
                console.error('Registration error:', error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }

    /*Authentication function to be export as route*/
    async authByCookie(req, res) {
        try {
            const { token } = req.body;

            // Use the service method
            const result = await authService.handleAuthByCookie(token);
            res.json(result);

        } catch (error) {
            if (error.message === 'NO_TOKEN_PROVIDED') {
                return res.status(401).json({ message: 'No token provided' });
            } else if (error.message === 'INVALID_TOKEN') {
                return res.status(401).json({ message: 'Invalid or expired token' });
            } else if (error.message === 'EXPIRED_TOKEN') {
                return res.status(401).json({ message: 'Token has expired' });
            } else if (error.message === 'USER_NOT_FOUND') {
                return res.status(401).json({ message: 'User not found' });
            } else {
                console.error('Auth by cookie error:', error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }
    
    /*Logout function to be export as route*/
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

    /*Verify Email function to be export as route*/
    async verifyEmail(req, res) {
        try {
            await authService.handleVerifyEmail(req.body.username, req.body.otp);
            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    /*Update Password Request OTP function to be export as route*/
    async PasswordUpdateOTP(req, res) {
        try {
            await authService.handlePasswordUpdate_OTP(req.body.UsernameOrEmail);
            res.json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    /*Reset Password function to be export as route*/
    async resetPassword(req, res) {
        try {
            await authService.handleResetPassword(
                req.body.UsernameOrEmail, 
                req.body.otp, 
                req.body.newPassword
            );
            res.json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    /*Resend OTP function to be export as route*/
    async resendOTP(req, res) {
        try {
            await authService.handleResendOTP(req.body.UsernameOrEmail);
            res.json({ message: 'New OTP sent successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();