const { ErrorHandler } = require('../errors');
const { loginValidator } = require('../validators');
const { jwtServise } = require('../servises');
const {
    statusCode, messageCode, constants: { AUTHORIZATION, FROM }, tokenTypeEnum: { REFRESH, FORGOT_PASSWORD }, tokenTypeEnum
} = require('../config');
const { OAuth, UserDB, Action } = require('../dataBase');

module.exports = {
    isUserEmailPresent: async (req, res, next) => {
        try {
            const { email } = req.body;
            const userByEmail = await UserDB.findOne({ email }).select('+password');

            if (!userByEmail) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, messageCode.WRONG_LOGINING);
            }

            req.user = userByEmail;

            next();
        } catch (e) {
            next(e);
        }
    },
    isUserPasswordPresent: async (req, res, next) => {
        try {
            const { user } = req;

            await user.comparePasswords(req.body.password);

            next();
        } catch (e) {
            next(e);
        }
    },
    validateLoginUser: (req, res, next) => {
        try {
            const { error } = loginValidator.loginUser.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, messageCode.WRONG_LOGINING);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            await jwtServise.verifyToken(token);
            const tokenRespons = await OAuth.findOne({ access_token: token });

            if (!tokenRespons) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            req.user = tokenRespons.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },
    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            await jwtServise.verifyToken(token, REFRESH);
            const tokenRespons = await OAuth.findOne({ refresh_token: token });

            if (!tokenRespons) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            req.user = tokenRespons.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },
    checkActivateToken: async (req, res, next) => {
        try {
            const { token } = req.params;

            await jwtServise.verifyToken(token, tokenTypeEnum.ACTION);

            const { user_id: user, _id } = await Action.findOne({ token, type: tokenTypeEnum.ACTION }).populate('user_id');

            if (!user) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            await Action.deleteOne({ _id });

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },
    checkTokenBefoNewPassword: async (req, res, next) => {
        try {
            const actionToken = req.get(FROM);

            if (!actionToken) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            await jwtServise.verifyToken(actionToken, FORGOT_PASSWORD);

            const tokenRespons = await Action.findOne({ token: actionToken, type: FORGOT_PASSWORD });

            if (!tokenRespons) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
            }

            req.user = tokenRespons.user_id;

            next();
        } catch (e) {
            next(e);
        }
    }
};
