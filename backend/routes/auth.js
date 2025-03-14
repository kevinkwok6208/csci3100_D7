const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Core authentication routes
/* "http://localhost:5001/api/auth/login"
    Parameters: {username, password}
    Function: Autheticate users and return JWT token.
    Method: Post
*/
router.post('/login', authController.login);

/* "http://localhost:5001/api/auth/register"
    Parameters: {UsernameOrEmail, password, email}
    Function: Allow users to register and create a new account 
    and gen OTP to users account
    Method: Post
*/
router.post('/register', authController.register);

// Email verification routes
/* "http://localhost:5001/api/auth/verify-email"
    Parameters: {username, otp}
    Function: Allow users to verify the email address by input OTP
    Method: Post
*/
router.post('/verify-email', authController.verifyEmail);

/* "http://localhost:5001/api/auth/resend-otp"
    Parameters: {username}
    Function: Allow user to resend OTP to their email address
    Method: Post
*/
router.post('/resend-otp', authController.resendOTP);


// Password management routes

/* "http://localhost:5001/api/auth/password-update-otp"
    Parameters: {UsernameOrEmail}
    Function: When user forgot their password, they can request a password reset,
              then a new OTP will be sent to their email address.
    Method: Post
*/
router.post('/password-update-otp', authController.PasswordUpdateOTP);

/* "http://localhost:5001/api/auth/reset-password"
    Parameters: {UsernameOrEmail, otp, newPassword}
    Function: When user forgot their password, they can request a password reset,
              then a new OTP will be sent to their email address.
    Method: Post
*/
router.post('/reset-password', authController.resetPassword);

// Cookie-based authentication routes
/* "http://localhost:5001/api/auth/auth-by-cookie"
    Parameters: {token}
    Function: If user have login before and within 30 minutes, user can login
              login by cookie token.
    Method: Post
*/
router.post('/auth-by-cookie', authController.authByCookie);

/* "http://localhost:5001/api/auth/logout"
    Parameters: {token}
    Function: if user logout, the cookies in database will be deleted.
    Method: Post
*/
router.post('/logout', authController.logout);


module.exports = router;
