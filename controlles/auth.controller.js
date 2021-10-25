const { OAuth } = require('../dataBase');
const { userUtil: { userNormalizator } } = require('../utils');
const { jwtServise, userServise } = require('../servises');
const { constants: { AUTHORIZATION }, messageCode } = require('../config');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { user } = req;
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
    }
};
