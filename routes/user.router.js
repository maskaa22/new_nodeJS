const router = require('express').Router();

const { userConttoller } = require('../controlles');
const { userMiddleware, authMiddleware } = require('../middlewares');
const { userRolesEnumConfig: { ADMIN, USER } } = require('../config');

router.post('/', userMiddleware.validateUserBody, userMiddleware.checkUniqueEmail, userConttoller.createUser);

router.use(authMiddleware.checkAccessToken, userMiddleware.isUserActive);

router.get('/', userConttoller.getAllUsers);

router.get('/:user_id',
    userMiddleware.isUserPresent,
    userConttoller.getSingleUsers);

router.delete('/:user_id',
    userMiddleware.isUserPresent,
    userMiddleware.checkUserRole([
        ADMIN,
        USER
    ]),
    userConttoller.deleteUser);

router.patch('/:user_id',
    userMiddleware.isUserPresent,
    userMiddleware.validateUserBodyName,
    userConttoller.updateUser);

module.exports = router;
