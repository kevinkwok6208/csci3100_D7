/**
 * Admin Controller
 * Handles administrative functions for user management
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const adminService = require('../services/adminUserService');

class AdminController {
    /**
     * Create a new user (admin function)
     */
    async createUser(req, res) {
        const { username, password, email, isadmin } = req.body;
        
        try {
            const result = await adminService.createUser(username, password, email, isadmin);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            if (error.message === 'Username already exists') {
                return res.status(400).json({ message: error.message });
            }
            else if (error.message === 'Email already exists') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Delete particular user
    async deleteUser(req, res) {
        try {
          const { username } = req.params;
          const result = await adminService.deleteUser(username);
          
          if (result) {
            res.json({ message: 'User deleted successfully' });
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          res.status(500).json({ message: 'Server error' });
        }
    }
      
    //Display all users info
    async getAllUsers(req, res) {
        try {
            const{username}= req.params;
            const users = await adminService.getAllUsers(username);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //Display particular user info
    async getUserInfo(req, res) {
        try {
            const {username} = req.params;
            const user = await adminService.getUserInfo(username);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //Update user password
    async updateUserPassword(req,res){
        try{
            const {username} = req.params;
            const {newPassword} = req.body;
            await adminService.updateUserPassword(username,newPassword);
            res.status(201).json({ message: 'User Password changed successfully' });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
    //Update user email
    async updateUserEmail(req,res){
        try{
            const {username}=req.params;
            const {newEmail}=req.body;
            await adminService.updateUserEmail(username,newEmail);
            res.status(201).json({ message: 'User Email changed successfully' });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();