const { ErrorHandler } = require('../errors');
const { UserDB } = require('../dataBase');
const { userServise } = require('../servises');
const { userValidator } = require('../validators');
const { statusCode, messageCode } = require('../config');

module.exports = {
    isUserPresent: async (req, res, next) => {
        try {
            const { user_id } = req.params;

            const user = await userServise.findUserById(UserDB, user_id);

            if (!user) {
                throw new ErrorHandler(statusCode.NOT_FOUND, messageCode.NOT_FOUND);
            }
            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },
    checkUniqueEmail: async (req, res, next) => {
        try {
            const { email } = req.body;

            const userByEmail = await UserDB.findOne({ email });

            if (userByEmail) {
                throw new ErrorHandler(statusCode.CONFLICT, messageCode.CONFLICT_EMAIL);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    validateUserBody: (req, res, next) => {
        try {
            const { error } = userValidator.createUserValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    validateUserBodyName: (req, res, next) => {
        try {
            const { error } = userValidator.updateUserValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    checkUserRole: (roleArr = []) => (req, res, next) => {
        try {
            const { role } = req.user;

            if (!roleArr.includes(role)) {
                throw new ErrorHandler(statusCode.FORBIDDED, messageCode.NOT_ACCESS);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
