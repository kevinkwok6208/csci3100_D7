const userMan = require('../services/userAccManService.js');
class UserAccManController {
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
}
module.exports = new UserAccManController();