const { UserDB } = require('../dataBase');
const { userServise, passwordServise, emailServise } = require('../servises');
const { userUtil: { userNormalizator } } = require('../utils');
const { emailActionEnum: { WELCOME, UPDATE, DELETE } } = require('../config');

module.exports = {
    getSingleUsers: (req, res, next) => {
        try {
            const { user } = req;

            res.json(user);
        } catch (e) {
            next(e);
        }
    },
    createUser: async (req, res, next) => {
        try {
            const { password } = req.body;
            const userName = req.body.name;

            const hashedPassword = await passwordServise.hash(password);

            await emailServise.sendMail(req.body.email, WELCOME, { userName });

            const createdUser = await userServise.createdUser(UserDB, { ...req.body, password: hashedPassword });

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
