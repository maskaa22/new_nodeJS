const { OAuth, UserDB, Action } = require('../dataBase');
const { userUtil: { userNormalizator } } = require('../utils');
const {
    jwtServise, userServise, emailServise, passwordServise
} = require('../servises');
const { constants: { AUTHORIZATION }, messageCode, statusCode } = require('../config');
const { ErrorHandler } = require('../errors');
const { tokenTypeEnum: { FORGOT_PASSWORD }, emailActionEnum, configUrl: { PROJECT_URL } } = require('../config');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { user } = req;

            await user.comparePasswords(req.body.password);

            const tokenPair = jwtServise.generateTokenPair();

            const userToReturn = userNormalizator(user);

            await OAuth.create({
                ...tokenPair,
                user_id: userToReturn._id
            });

            res.json({
                user: userToReturn,
                ...tokenPair
            });
        } catch (e) {
            next(e);
        }
    },
    logout: async (req, res, next) => {
        try {
            const access_token = req.get(AUTHORIZATION);
            await userServise.deleteOneUser(OAuth, { access_token });

            res.json(messageCode.DELETED);
        } catch (e) {
            next(e);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            const tokenPair = jwtServise.generateTokenPair();

            await OAuth.updateOne({ refresh_token: token }, { ...tokenPair });

            res.json(tokenPair);
        } catch (e) {
            next(e);
        }
    },
    activate: async (req, res, next) => {
        try {
            const { _id } = req.user;

            await UserDB.updateOne({ _id }, { is_active: true });

            res.json('User is Active');
        } catch (e) {
            next(e);
        }
    },
    sendMailForgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await UserDB.findOne({ email });

            if (!user) {
                throw new ErrorHandler(statusCode.NOT_FOUND, messageCode.NOT_FOUND);
            }

            const actionToken = jwtServise.generateActionTokenForPassword(FORGOT_PASSWORD);

            await Action.create({
                token: actionToken,
                type: FORGOT_PASSWORD,
                user_id: user._id
            });

            // eslint-disable-next-line max-len
            await emailServise.sendMail(email, emailActionEnum.FORGOT_PASSWORD, { forgotPasswordUrl: `${PROJECT_URL}passwordForgot?token=${actionToken}` });

            res.json('OK');
        } catch (e) {
            next(e);
        }
    },
    setNewPasswordAfterForgot: async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { new_password } = req.body;

            const hashedPassword = await passwordServise.hash(new_password);

            await userServise.updateUserById(UserDB, _id, { password: hashedPassword });

            await OAuth.deleteMany({ _id });

            res.json('Well donn');
        } catch (e) {
            next(e);
        }
    },
};
