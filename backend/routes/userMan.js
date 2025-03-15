const express = require('express');
const router = express.Router();
const userManController = require('../controllers/userAccManControllers');

router.post('/update-password',userManController.updatePassword);

module.exports = router;

