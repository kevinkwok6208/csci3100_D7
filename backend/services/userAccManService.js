const User = require('../models/User');
const OTP = require('../models/OTP');
const authConfig = require('../config/auth_info'); 
const bcrypt = require('bcryptjs');

class userAccManService {
    async changePassword(username,password,newPassword,otp) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                throw new Error('Invalid password');
            }

            const currentotp = await OTP.findOne({
                userId: user._id,
                purpose: 'password_UpdateOrReset'
              });
            if (!currentotp){
                throw new Error('OTP not found');
            }
            if (currentotp.code!==otp){
                throw new Error('Invalid OTP');
            }
            const newhashedPassword = await bcrypt.hash(newPassword, authConfig.saltRounds);
            const Updateuser=await User.findOneAndUpdate(user._id, 
                                {hashedPassword:newhashedPassword},
                                                        {new:true}
                                                        );
            if (!Updateuser){
                throw new Error('Failed to update password');
            }
            const deleteOTP=await OTP.deleteOne({userId:user._id});
            if (!deleteOTP){
                throw new Error('Failed to delete OTP');
            }
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
  
}
module.exports = new userAccManService();