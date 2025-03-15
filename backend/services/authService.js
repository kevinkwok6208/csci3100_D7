const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth_info');
const Cookie = require('../models/Cookie');

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

    async handleLogin(UsernameOrEmail, password) {
        // Find user by username or email
        const { user, isEmail } = await this.findUserByIdentifier(UsernameOrEmail);
        
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
    
        // Generate JWT token with user information
        const token = jwt.sign(
            { userId: user._id, username: user.username, isadmin: user.isadmin },
            authConfig.jwtSecret,
            { expiresIn: authConfig.jwtExpiresIn }
        );
    
        // Calculate token expiry date
        const expiryTimeInSeconds = typeof authConfig.jwtExpiresIn === 'string'
            ? (authConfig.jwtExpiresIn.endsWith('h')
                ? parseInt(authConfig.jwtExpiresIn) * 3600
                : authConfig.jwtExpiresIn.endsWith('m')
                    ? parseInt(authConfig.jwtExpiresIn) * 60
                    : parseInt(authConfig.jwtExpiresIn))
            : authConfig.jwtExpiresIn;
    
        const expiryDate = new Date(Date.now() + expiryTimeInSeconds * 1000);
        // Adjust for Hong Kong timezone
        const adjustedExpiry = this.adjustDateForTimezone(expiryDate);
    
        // Save token to Cookie collection
        await Cookie.findOneAndUpdate(
            { userId: user._id },
            { 
                userId: user._id,
                username: user.username,
                token: token,
                expires: adjustedExpiry
            },
            { upsert: true, new: true }
        );
    
        // Return login result
        return {
            token,
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

    async handleAuthByCookie(token) {
        // Check if no token is provided
        if (!token) {
            throw new Error('NO_TOKEN_PROVIDED');
        }

        // Find the cookie entry in the database
        const cookieEntry = await Cookie.findOne({ token });
        if (!cookieEntry) {
            throw new Error('INVALID_TOKEN');
        }

        // Get current time with timezone adjustment
        const adjustedCurrentTime = this.getCurrentAdjustedTime();

        // Check if token has expired
        if (cookieEntry.expires < adjustedCurrentTime) {
            await Cookie.deleteOne({ _id: cookieEntry._id });
            throw new Error('EXPIRED_TOKEN');
        }

        // Get user data
        const user = await User.findOne({ _id: cookieEntry.userId });
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        // Return the specific fields needed for the response
        return {
            token,
            isadmin: user.isadmin,
            username: user.username
        };
    }

    async handleVerifyEmail(UsernameOrEmail, otpCode) {
        // Find user by username or email
        const {user,isEmail} = await this.findUserByIdentifier(UsernameOrEmail);
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

    async handlePasswordUpdate_OTP(UsernameOrEmail) {
        // First check if input is null or undefined
        if (!UsernameOrEmail) {
          throw new Error('Username or email is required');
        }
      
        // Find user by username or email
        const { user, isEmail } = await this.findUserByIdentifier(UsernameOrEmail);
        
        if (!user) {
          throw new Error('User not found');
        }
      
        // Create and save OTP
        const { otp } = await this.createAndSaveOTP(user, 'password_UpdateOrReset');
      
        // Send OTP to user's email
        await emailService.sendOTP(isEmail ? UsernameOrEmail : user.email, otp);
        
        return { success: true, message: 'OTP sent successfully' };
    }

    async handleResetPassword(UsernameOrEmail, otpCode, newPassword) {
        // Find user by username or email
        const { user } = await this.findUserByIdentifier(UsernameOrEmail);
        
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

    async validateToken(token) {
        const cookieEntry = await Cookie.findOne({ token });
        
        if (!cookieEntry || cookieEntry.expires < new Date()) {
            return null;
        }
        
        return cookieEntry;
    }
    
    async invalidateAllUserTokens(userId) {
        await Cookie.deleteMany({ userId });
    }
}

module.exports = new AuthService();
