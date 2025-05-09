/**
 * Admin Service
 * Contains business logic for admin operations
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth_info');


class AdminService {
    /**
     * Create a new user
     */
    async createUser(username, password, email, isadmin) {
        // Check if username already exists
        const existingUser = await User.findOne({ username:username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const existingEmail = await User.findOne({ email:email });
        if (existingEmail) {
            throw new Error('Email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);

        // Create new user
        const user = new User({
            username,
            hashedPassword,
            email,
            isadmin: isadmin ? 1 : 0,
            isEmailVerified: isadmin? true : false
        });

        // Save and return user
        return await user.save();
    }

    async deleteUser(username) {
        const result = await User.deleteOne({ username });
        return result.deletedCount > 0;
    }
    
    //display all users info
    async getAllUsers(req, res) {
        const users = await User.find({}, { password: 0 });
        return users;
    }

    //display particular user info
    async getUserInfo(username) {
        try {
            const user = await User.findOne(
                {username:username}
            );
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return user;
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    //change user password
    async updateUserPassword(username, newPassword) {
        // Find user by username or email
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, authConfig.saltRounds);
        // Update the user's password
        await User.updateOne(
            { username: user.username },
            { hashedPassword }
        )
    }

    //change user email
    async updateUserEmail(username,newEmail){
        const user = await User.findOne({ username });
        const existingEmail = await User.findOne({ email:newEmail });
        if (existingEmail) {
            throw new Error('Email already exists');
        }
        if (!user) {
            throw new Error('User not found');
        }
        // Update the user's email
        await User.updateOne(
                {username: user.username},
                {$set:{
                    email: newEmail,
                    isEmailVerified: user.isadmin? true : false
                }}
        );
    }
}



module.exports = new AdminService();