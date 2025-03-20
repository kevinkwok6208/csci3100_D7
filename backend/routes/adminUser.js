/**
 * Admin Routes
 * Handles admin API endpoints for user management
*/
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminUserController');

// Create user route
/*  "http://localhost:5001/api/admin-user/create-users"
    "https://localhost:5443/api/admin-user/create-users"
    Parameters: {username, password, email, isadmin}
    Function: Allow admin to create new users
    Method: Post
*/
router.post('/create-users', adminController.createUser);

// Delete user route
/* "http://localhost:5001/api/admin-user/delete-users/:username"
    "https://localhost:5443/api/admin-user/delete-users/:username"
    Parameters: req.params{username}
    Function: Allow admin to delete users account.
    Method: Post
*/
router.post('/delete-users/:username', adminController.deleteUser);    

// Display all users info route
/* "http://localhost:5001/api/admin-user/get-allusers"
    "https://localhost:5443/api/admin-user/get-allusers"
    Parameters: None
    Function: Allow admin dashboard to display all users info.
    Method: Get
*/
router.get('/get-allusers', adminController.getAllUsers);

//Display particular user info route
/*  "http://localhost:5001/api/admin-user/get-userinfo/:username"
    "https://localhost:5443/api/admin-user/get-userinfo/:username"
    Parameters: None
    Function: Allow admin dashboard to display all users info.
    Method: Get
*/
router.get('/get-userinfo/:username', adminController.getUserInfo);

/*  "http://localhost:5001/api/admin-user/update-userpassword/:username"
    "https://localhost:5443/api/admin-user/update-userpassword/:username"
    Parameters: req.params{username}, {newPassword}
    Function: Allow admin dashboard to change user password.
    Method: Post
*/
router.post('/update-userpassword/:username', adminController.updateUserPassword);

/* "http://localhost:5001/api/admin-user/update-useremail/:username"
    "https://localhost:5443/api/admin-user/update-useremail/:username"
    Parameters: req.params{username}, {newEmail}
    Function: Allow admin dashboard to change user email.
    Method: Post
*/
router.post('/update-useremail/:username', adminController.updateUserEmail);


module.exports = router;