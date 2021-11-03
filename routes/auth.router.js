const router = require('express').Router();

const { authController } = require('../controlles');
const {
    authMiddleware: {
        isUserEmailPresent,
        validateLoginUser,
        checkAccessToken,
        checkRefreshToken,
        checkActivateToken,
        checkTokenBefoNewPassword,
        isUserPasswordPresent
    }
} = require('../middlewares');

router.post('/',
    validateLoginUser,
    isUserEmailPresent,
    authController.login);

router.post('/logout', checkAccessToken, authController.logout);

router.post('/refresh', checkRefreshToken, authController.refresh);

router.get('/activate/:token', checkActivateToken, authController.activate);

router.post('/password/forgot', checkAccessToken, authController.sendMailForgotPassword);

// eslint-disable-next-line max-len
router.post('/password/forgot/set', checkAccessToken, checkTokenBefoNewPassword, isUserPasswordPresent, authController.setNewPasswordAfterForgot);

module.exports = router;
