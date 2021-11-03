module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_CONNECT_URL: process.env.MONGO_CONNECT_URL || 'mongodb://localhost:27017/june-2021',

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'zzz',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'xxx',
    JWT_ACTION_SECRET: process.env.JWT_ACTION_SECRET || 'qqq',
    JWT_ACTION_FORGOT_PASSWORD_SECRET: process.env.JWT_ACTION_FORGOT_PASSWORD_SECRET || 'aaa',
    JWT_ACTION_TOKEN_SECRET: process.env.JWT_ACTION_TOKEN_SECRET || 'ttt',

    NO_REPLY_EMAIL_PASSWORD: process.env.NO_REPLY_EMAIL_PASSWORD,
    NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
};
