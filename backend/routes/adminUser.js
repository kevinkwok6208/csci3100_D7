/**
 * Admin Routes
 * Handles admin API endpoints for user management
*/
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminUserController');

// Create user route
/* "http://localhost:5001/api/admin/create-users"
    Parameters: {username, password, email, isadmin}
    Function: Allow admin to create new users
    Method: Post
*/
router.post('/create-users', adminController.createUser);

// Delete user route
/* "http://localhost:5001/api/admin/delete-users"
    Parameters: None
    Function: Allow admin to delete users account.
    Method: Post
*/
router.post('/delete-users/:username', adminController.deleteUser);    

// Display all users info route
/* "http://localhost:5001/api/admin/get-allusers"
    Parameters: None
    Function: Allow admin dashboard to display all users info.
    Method: Get
*/
router.get('/get-allusers', adminController.getAllUsers);

//Display particular user info route
/* "http://localhost:5001/api/admin/get-userinfo/:username"
    Parameters: None
    Function: Allow admin dashboard to display all users info.
    Method: Get
*/
router.get('/get-userinfo/:username', adminController.getUserInfo);
module.exports = router;