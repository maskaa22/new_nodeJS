const router = require('express').Router();

const { userConttoller } = require('../controlles');
const { userMiddleware, authMiddleware } = require('../middlewares');
const { userRolesEnumConfig: { ADMIN, USER } } = require('../config');

router.get('/', userConttoller.getAllUsers);

router.post('/', userMiddleware.validateUserBody, userMiddleware.checkUniqueEmail, userConttoller.createUser);

router.get('/:user_id',
    userMiddleware.isUserPresent,
    userConttoller.getSingleUsers);

router.delete('/:user_id',
    userMiddleware.isUserPresent,
    userMiddleware.checkUserRole([
        ADMIN,
        USER
    ]),
    authMiddleware.checkAccessToken,
    userConttoller.deleteUser);

router.patch('/:user_id',
    userMiddleware.isUserPresent,
    authMiddleware.checkAccessToken,
    userMiddleware.validateUserBodyName,
    userConttoller.updateUser);

module.exports = router;
