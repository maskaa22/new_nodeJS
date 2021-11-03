const { UserDB, Action } = require('../dataBase');
const {
    userServise, emailServise, jwtServise
} = require('../servises');
const { userUtil: { userNormalizator } } = require('../utils');
const { emailActionEnum: { WELCOME, UPDATE, DELETE }, tokenTypeEnum: { ACTION } } = require('../config');

module.exports = {
    getSingleUsers: (req, res, next) => {
        try {
            const { user } = req;

            const userToReturn = userNormalizator(user);

            res.json(userToReturn);
        } catch (e) {
            next(e);
        }
    },
    createUser: async (req, res, next) => {
        try {
            const userName = req.body.name;

            const createdUser = await UserDB.createUserWithHashPassword(req.body);

            const token = jwtServise.createActionToken();

            await Action.create({ token, type: ACTION, user_id: createdUser._id });

            await emailServise.sendMail(req.body.email, WELCOME, { userName, token });

            const userToReturn = userNormalizator(createdUser);

            res.json(userToReturn);
        } catch (e) {
            next(e);
        }
    },
    getAllUsers: async (req, res, next) => {
        try {
            const users = await userServise.findAllUser(UserDB);

            res.json(users);
        } catch (e) {
            next(e);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const userName = req.user.name;
            const userEmail = req.user.email;

            await emailServise.sendMail(userEmail, DELETE, { userName });

            await userServise.deleteOneUser(UserDB, user_id);

            res.json(`User with id ${user_id} is deleted`);
        } catch (e) {
            next(e);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const newUser = req.body;
            const userName = req.user.name;
            const userEmail = req.user.email;

            await emailServise.sendMail(userEmail, UPDATE, { userName });

            await userServise.updateUserById(UserDB, user_id, newUser);

            res.json(`User with id ${user_id} is update`);
        } catch (e) {
            next(e);
        }
    }
};
