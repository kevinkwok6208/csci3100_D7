const express = require('express');
const router = express.Router();
const userManController = require('../controllers/userAccManControllers');

/* "http://localhost:5001/api/user-manage/update-password"
    Parameters:{username, password, newPassword, otp}
    Function: User can change their password after verify their otp. To get the otp,
              refer to endpoint (auth/password-update-otp)
    Method: Post
*/
router.post('/update-password', userManController.updatePassword);

/* "http://localhost:5001/api/user-manage/initiate-email-change"
    Parameters:{username, newEmail}
    Function: User input new email and initiate the email change process. OTP will be sent to the new email.
    Method: Post
*/
router.post('/initiate-email-change', userManController.initiateEmailChange);

/* "http://localhost:5001/api/user-manage/complete-email-change"
    Parameters:{username, otp}
    Function: After verify the otp, user can complete the email change.
    Method: Post
*/
router.post('/complete-email-change', userManController.completeEmailChange);

module.exports = router;
