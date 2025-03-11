module.exports = {
    jwtSecret: 'your_jwt_secret',
    jwtExpiresIn: '30m',
    otpExpiryMinutes: 5,
    saltRounds: 10,
    emailVerificationRequired: true,
    timezone: {
        offset: 8, // Hong Kong timezone UTC+8
        adjustmentInHours: 8
    }
};
