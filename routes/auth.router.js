const router = require('express').Router();

const { authController } = require('../controlles');
const {
    authMiddleware: {
        isUserEmailPresent,
        isUserPasswordPresent,
        validateLoginUser,
        checkAccessToken,
        checkRefreshToken
    }
} = require('../middlewares');

router.post('/',
    validateLoginUser,
    isUserEmailPresent,
    isUserPasswordPresent,
    authController.login);

router.post('/logout', checkAccessToken, authController.logout);

router.post('/refresh', checkRefreshToken, authController.refresh);

module.exports = router;
