const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Core authentication routes
/*  "http://localhost:5001/api/auth/login"
    "https://localhost:5443/api/auth/login"
    Parameters: {usernameOrEmail, password}
    Function: Autheticate users and return JWT token.
    Method: Post
*/
router.post('/login', authController.login);

/*  "http://localhost:5001/api/auth/register"
    "https://localhost:5443/api/auth/register"
    Parameters: {username, password, email}
    Function: Allow users to register and create a new account 
    and gen OTP to users account
    Method: Post
*/
router.post('/register', authController.register);

// Email verification routes
/*  "http://localhost:5001/api/auth/verify-email"
    "https://localhost:5443/api/auth/verify-email"
    Parameters: {usernameOrEmail, otp}
    Function: Allow users to verify the email address by input OTP
    Method: Post
*/
router.post('/verify-email', authController.verifyEmail);

/*  "http://localhost:5001/api/auth/resend-email-otp"
    "https://localhost:5443/api/auth/resend-email-otp"
    Parameters: {usernameOrEmail}
    Function: Allow users to resend OTP to their email address
    Method: Post
*/
router.post('/resend-email-otp', authController.resendEmailOTP);

// Password management routes

/*  "http://localhost:5001/api/auth/password-update-otp"
    "https://localhost:5443/api/auth/password-update-otp"
    Parameters: {usernameOrEmail}
    Function: When user forgot their password, they can request a password reset,
              then a new OTP will be sent to their email address.
    Method: Post
*/
router.post('/password-update-otp', authController.PasswordUpdateOTP);

/*  "http://localhost:5001/api/auth/reset-password"
    "https://localhost:5443/api/auth/reset-password"
    Parameters: {usernameOrEmail, otp, newPassword}
    Function: When user forgot their password, they can request a password reset,
              then a new OTP will be sent to their email address.
    Method: Post
*/
router.post('/reset-password', authController.resetPassword);

module.exports = router;
