const { UserDB } = require('../dataBase');
const { userRolesEnumConfig: { ADMIN }, variablesConfig: { DEFAULD_PASSWORD, DEFAULD_EMAIL } } = require('../config');

module.exports = async () => {
    const user = await UserDB.findOne({ role: ADMIN });

    if (!user) {
        await UserDB.createUserWithHashPassword({
            name: 'lola',
            email: DEFAULD_EMAIL,
            password: DEFAULD_PASSWORD,
            role: ADMIN
        });
    }
};
