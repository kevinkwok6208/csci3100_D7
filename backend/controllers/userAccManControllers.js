const userMan = require('../services/userAccManService.js');

class UserAccManController {
    //Allow User to change their password after OTP verify.
    async updatePassword(req, res) {
        const { username, password, newPassword, otp } = req.body;
        try {
            const result = await userMan.changePassword(username, password, newPassword, otp);
            res.json(result);
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: error.message });
        }
    }
    
    // Send OTP to new email
    async initiateEmailChange(req, res) {
        const { username,newEmail } = req.body;
        try {
            const result = await userMan.initiateEmailChange(username, newEmail);
            res.json(result);
        } catch (error) {
            console.error('Email change initiation error:', error);
            res.status(500).json({ message: error.message });
        }
    }
    
    // Verify the OTP from new email and complete the email change.
    async completeEmailChange(req, res) {
        const { username, otp } = req.body;
        try {
            const result = await userMan.completeEmailChange(username, otp);
            res.json(result);
        } catch (error) {
            console.error('Email change completion error:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserAccManController();
