const { ErrorHandler } = require('../errors');
const { loginValidator } = require('../validators');
const { passwordServise, jwtServise } = require('../servises');
const {
    statusCode, messageCode, constants: { AUTHORIZATION }, tokenTypeEnum: { REFRESH }
} = require('../config');
const { OAuth, UserDB } = require('../dataBase');

module.exports = {
    isUserEmailPresent: async (req, res, next) => {
        try {
            const { email } = req.body;
            const userByEmail = await UserDB.findOne({ email }).select('+password').lean();

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
            const { password } = req.body;
            const { password: hashPassword } = req.user;

            await passwordServise.compare(password, hashPassword);

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
            const tokenRespons = await OAuth.findOne({ access_token: token }).populate('user_id');

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
            const tokenRespons = await OAuth.findOne({ refresh_token: token }).populate('user_id');

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
