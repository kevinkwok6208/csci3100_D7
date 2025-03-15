const User = require('../models/User');
const OTP = require('../models/OTP');
const authService = require('./authService');
const authConfig = require('../config/auth_info'); 
const bcrypt = require('bcryptjs');
const emailService = require('./emailService');
const { use } = require('react');

class userAccManService {
    async changePassword(username, password, newPassword, otp) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                throw new Error('Invalid password');
            }

            await authService.validateOTP(user._id, otp, 'password_UpdateOrReset');
            const newhashedPassword = await bcrypt.hash(newPassword, authConfig.saltRounds);
            const Updateuser = await User.findOneAndUpdate(user._id, 
                                {hashedPassword: newhashedPassword},
                                {new: true}
                                );
            if (!Updateuser){
                throw new Error('Failed to update password');
            }
            const deleteOTP = await OTP.deleteOne({userId: user._id});
            if (!deleteOTP){
                throw new Error('Failed to delete OTP');
            }
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
    
    // New method to initiate email change process
    async initiateEmailChange(username,newEmail) {
        try {
            // Verify user exists and password is correct
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }
             
            // Check if new email already exists in the system
            const emailExists = await User.findOne({ email: newEmail });
            if (emailExists) {
                throw new Error('Email already in use');
            }
            
            // Generate OTP
            const {otp,otpRecord}=await authService.createAndSaveOTP(user._id, 'email_change', newEmail);
            // Send OTP to the NEW email address
            await emailService.sendOTP(newEmail, otp);
            
            return { 
                success: true, 
                message: 'Verification code sent to new email address' 
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Method to complete the email change after OTP verification
    async completeEmailChange(username, otp) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }
            
            // Find the OTP record
            const otpRecord= await authService.validateOTP(user._id, otp, 'email_change');
            
            // Update the user's email
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { email: otpRecord.newEmail },
                { new: true }
            );
            
            if (!updatedUser) {
                throw new Error('Failed to update email');
            }
            
            // Delete the OTP record
            await OTP.deleteOne({ _id: otpRecord._id });
            
            return {
                success: true,
                message: 'Email updated successfully',
                newEmail: updatedUser.email
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new userAccManService();
