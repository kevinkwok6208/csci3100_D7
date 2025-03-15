const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth_info');
const Cookie = require('../models/Cookie');

class AuthService {
    async handleLogin(UsernameOrEmail, password) {
        // Find user by username
        let user;
        const isEmail = UsernameOrEmail.includes('@');
        if (isEmail) {
            user = await User.findOne({ email: UsernameOrEmail });
        } else {
            user = await User.findOne({ username: UsernameOrEmail });
        }
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
            { userId: user._id, username:user.username, isadmin: user.isadmin },
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
        expiryDate.setUTCHours(expiryDate.getUTCHours() + authConfig.timezone.adjustmentInHours);
    
        // Save token to Cookie collection
        await Cookie.findOneAndUpdate(
            { userId: user._id },
            { 
                userId: user._id,
                username: user.username,
                token: token,
                expires: expiryDate
            },
            { upsert: true, new: true }
        );
    
        // Return login result
        return {
            token,
            isadmin: user.isadmin,
            username:user.username
        };
    }

    async handleRegister(username, password, email) {
        // Check if username already exists
        const existingUser = await User.findOne({ 
            username: username 
        });
        
        if (existingUser) {
            throw new Error('USERNAME_EXISTS');
        }
        
        const existingEmail = await User.findOne({
            email: email
        });
        if (existingEmail) {
            throw new Error('EMAIL_EXISTS');
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);
        
        // Create new user
        const user = new User({
            username,
            hashedPassword: hashedPassword,
            email,
            isadmin: 0,
            isEmailVerified: false
        });
    
        // Save the user
        await user.save();
        
        // Send OTP for email verification
        await this.handleResendOTP(username);
        
        // Return registration result
        return { 
            username,
            email
        };
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

        // Convert currentTime to Hong Kong timezone
        const currentTime = new Date();
        const adjustedCurrentTime = new Date(currentTime);
        adjustedCurrentTime.setUTCHours(
            currentTime.getUTCHours() + authConfig.timezone.adjustmentInHours
        );

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


    
    async handleVerifyEmail(username, otpCode) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const now = new Date();
        now.setUTCHours(now.getUTCHours() + authConfig.timezone.adjustmentInHours);
        
        const otpRecord = await OTP.findOne({ 
            userId: user._id,
            purpose: 'email_verification',
            code: otpCode
        });
        
        if (!otpRecord || otpRecord.expiry < now) {
            throw new Error('Invalid or expired OTP');
        }

        await User.updateOne(
            { username },
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
      
        const isEmail = UsernameOrEmail.includes('@');
        
        // Declare user variable outside the if/else blocks
        let user;
      
        if (isEmail) {
          user = await User.findOne({ email: UsernameOrEmail });
          if (!user) {
            throw new Error('User not found');
          }
        } else {
          user = await User.findOne({ username:UsernameOrEmail });
          if (!user) {
            throw new Error('User not found');
          }
        }
      
        const otp = emailService.generateOTP();
        const otpExpiry = new Date(Date.now() + authConfig.otpExpiryMinutes * 60000);
        otpExpiry.setUTCHours(otpExpiry.getUTCHours() + authConfig.timezone.adjustmentInHours);
      
        // Save OTP for password reset
        await OTP.findOneAndUpdate(
          { userId: user._id },
          {
            userId: user._id,
            username: user.username, // Use user.username instead of the parameter
            code: otp,
            expiry: otpExpiry,
            purpose: 'password_UpdateOrReset'
          },
          { upsert: true, new: true }
        );
      
        // Now user.email is accessible
        if (isEmail) {
          await emailService.sendOTP(UsernameOrEmail, otp);
        } else {
          await emailService.sendOTP(user.email, otp);
        }
        
        return { success: true, message: 'OTP sent successfully' };
      }

    async handleResetPassword(UsernameOrEmail, otpCode, newPassword) {
        const isEmail = UsernameOrEmail.includes('@');
        let user;
        // Check if input is email or username
        if (isEmail) {
            user = await User.findOne({ email: UsernameOrEmail });
        } else {
            user = await User.findOne({ username: UsernameOrEmail });
        }

        // check if user exists
        if (!user) {
            throw new Error('User not found');
        }
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + authConfig.timezone.adjustmentInHours);
        
        const otpRecord = await OTP.findOne({ 
            userId: user._id,
            purpose: 'password_UpdateOrReset',
            code: otpCode
        });
        
        if (!otpRecord || otpRecord.expiry < now) {
            throw new Error('Invalid or expired OTP');
        }

        const hashedPassword = await bcrypt.hash(newPassword, authConfig.saltRounds);
        await User.updateOne(
            { username:user.username },
            { hashedPassword: hashedPassword }
        );

        // Remove the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });
    }

    async handleResendOTP(UsernameOrEmail) {
        let user;
        const isEmail = UsernameOrEmail.includes('@');
        if (isEmail) {
            user = await User.findOne({ email: UsernameOrEmail });
            if (!user){
                throw new Error('User not found');
            }
        } else {
            user = await User.findOne({ username: UsernameOrEmail });
            if (!user){
                throw new Error('User not found');
            }
        }
        const otp = emailService.generateOTP();
        const otpExpiry = new Date(Date.now() + authConfig.otpExpiryMinutes * 60000);
        otpExpiry.setUTCHours(otpExpiry.getUTCHours() + authConfig.timezone.adjustmentInHours);

        // Determine purpose based on email verification status
        const purpose = user.isEmailVerified ? 'password_UpdateOrReset' : 'email_verification';
        
        // Save new OTP without purpose distinction
        await OTP.findOneAndUpdate(
            { userId: user._id },
            { 
                userId: user._id,
                username: user.username,
                code: otp,
                expiry: otpExpiry,
                purpose
            },
            { upsert: true, new: true }
        );

        await emailService.sendOTP(user.email, otp);
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