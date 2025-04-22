const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth_info');

class AuthService {
    // Helper to find user by username or email
    async findUserByIdentifier(usernameOrEmail) {
        const isEmail = usernameOrEmail.includes('@');
        let user;
        
        if (isEmail) {
            user = await User.findOne({ email: usernameOrEmail });
        } else {
            user = await User.findOne({ username: usernameOrEmail });
        }
        
        return { user, isEmail };
    }
    
    // Helper to adjust date for timezone
    adjustDateForTimezone(date) {
        const adjustedDate = new Date(date);
        adjustedDate.setUTCHours(
            date.getUTCHours() + authConfig.timezone.adjustmentInHours
        );
        return adjustedDate;
    }
    
    // Helper to get current time with timezone adjustment
    getCurrentAdjustedTime() {
        const now = new Date();
        return this.adjustDateForTimezone(now);
    }
    
    // Helper to validate OTP
    async validateOTP(userId, otpCode, purpose) {
        const now = this.getCurrentAdjustedTime();
        
        const otpRecord = await OTP.findOne({ 
            userId: userId,
            purpose: purpose,
            code: otpCode
        });
        
        if (!otpRecord || otpRecord.expiry < now || otpCode!== otpRecord.code) {
            throw new Error('Invalid or expired OTP');
        }
        
        return otpRecord;
    }
    
    // Helper to create and save OTP
    async createAndSaveOTP(user, purpose, newEmail = null) {
        const otp = emailService.generateOTP();
        const otpExpiry = new Date(Date.now() + authConfig.otpExpiryMinutes * 60000);
        const adjustedExpiry = this.adjustDateForTimezone(otpExpiry);
        
        // Prepare OTP data
        const otpData = { 
            userId: user._id,
            username: user.username,
            code: otp,
            expiry: adjustedExpiry,
            purpose
        };
        
        // If this is for email change and newEmail is provided, add it to the OTP data
        if (purpose === 'email_change' && newEmail) {
            otpData.newEmail = newEmail;
        }
        
        // Save new OTP
        const otpRecord = await OTP.findOneAndUpdate(
            { userId: user._id, purpose: purpose },
            otpData,
            { upsert: true, new: true }
        );
        
        return { otp, otpRecord };
    }
    
    // Helper to hash password
    async hashPassword(password) {
        return bcrypt.hash(password, authConfig.saltRounds);
    }

    async handleLogin(usernameOrEmail, password) {
        // Find user by username or email
        const {user} = await this.findUserByIdentifier(usernameOrEmail);
        
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }
        
        // Verify password match
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            throw new Error('INVALID_CREDENTIALS');
        }
    
        // Check if email is verified
        if (!user.isEmailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED');
        }
     
        // Return login result
        return {
            isadmin: user.isadmin,
            username: user.username
        };
    }

    async handleRegister(username, password, email) {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        
        if (existingUser) {
            throw new Error('USERNAME_EXISTS');
        }
        
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw new Error('EMAIL_EXISTS');
        }
        
        // Hash the password
        const hashedPassword = await this.hashPassword(password);
        
        // Create new user
        const user = new User({
            username,
            hashedPassword,
            email,
            isadmin: 0,
            isEmailVerified: false
        });
    
        // Save the user
        await user.save();
        
        // Send OTP for email verification
        await this.handleRegisterEmailOTP(username,'email_verification', email);
        
        // Return registration result
        return { username, email };
    }

    async handleVerifyEmail(usernameOrEmail, otpCode) {
        // Find user by username or email
        const {user,isEmail} = await this.findUserByIdentifier(usernameOrEmail);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }
        // Use the helper method
        const otpRecord = await this.validateOTP(user._id, otpCode, 'email_verification');

        await User.updateOne(
            { username: user.username },
            { isEmailVerified: true }
        );

        // Remove the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });
    }

    async handleResendEmailVerify_OTP(usernameOrEmail) {
        // First check if input is null or undefined
        if (!usernameOrEmail) {
          throw new Error('Username or email is required');
        }
      
        // Find user by username or email
        const { user, isEmail } = await this.findUserByIdentifier(usernameOrEmail);
        
        if (!user) {
          throw new Error('User not found');
        }
      
        // Create and save OTP
        const { otp } = await this.createAndSaveOTP(user, 'email_verification');
      
        // Send OTP to user's email
        await emailService.sendOTP(isEmail ? usernameOrEmail : user.email, otp);
        
        return { success: true, message: 'OTP sent successfully' };
    }

    async handlePasswordUpdate_OTP(usernameOrEmail) {
        // First check if input is null or undefined
        if (!usernameOrEmail) {
          throw new Error('Username or email is required');
        }
      
        // Find user by username or email
        const { user, isEmail } = await this.findUserByIdentifier(usernameOrEmail);
        
        if (!user) {
          throw new Error('User not found');
        }
      
        // Create and save OTP
        const { otp } = await this.createAndSaveOTP(user, 'password_UpdateOrReset');
      
        // Send OTP to user's email
        await emailService.sendOTP(isEmail ? usernameOrEmail : user.email, otp);
        
        return { success: true, message: 'OTP sent successfully' };
    }

    async handleResetPassword(usernameOrEmail, otpCode, newPassword) {
        // Find user by username or email
        const { user } = await this.findUserByIdentifier(usernameOrEmail);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Validate OTP
        const otpRecord = await this.validateOTP(user._id, otpCode, 'password_UpdateOrReset');

        // Hash the new password
        const hashedPassword = await this.hashPassword(newPassword);
        
        // Update user's password
        await User.updateOne(
            { username: user.username },
            { hashedPassword }
        );

        // Remove the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });
    }

    async handleRegisterEmailOTP(username,purpose,targetEmail) {
        // Find user by username or email
        const user= await User.findOne({ username });
         
        //Check user exist
        if (!user) {
            throw new Error('User not found');
        }
        
        // Create and save OTP
        const { otp, otpRecord } = await this.createAndSaveOTP(user, purpose, targetEmail);
        
        // Send OTP to the appropriate email
        await emailService.sendOTP(user.email, otp);
        
        return { success: true, message: 'OTP sent successfully' };
    }
}

module.exports = new AuthService();
