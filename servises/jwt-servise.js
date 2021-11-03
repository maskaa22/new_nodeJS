const jwt = require('jsonwebtoken');

const { ErrorHandler } = require('../errors');
const {
    variablesConfig: {
        JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET,
        JWT_ACTION_SECRET,
        JWT_ACTION_FORGOT_PASSWORD_SECRET,
        JWT_ACTION_TOKEN_SECRET
    },
    tokenTypeEnum: { ACCESS }, tokenTypeEnum
} = require('../config');
const { statusCode, messageCode } = require('../config');

module.exports = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return {
            access_token,
            refresh_token
        };
    },
    verifyToken: async (token, tokenType = ACCESS) => {
        try {
            let secret = '';
            switch (tokenType) {
                case tokenTypeEnum.ACCESS:
                    secret = JWT_ACCESS_SECRET;
                    break;
                case tokenTypeEnum.REFRESH:
                    secret = JWT_REFRESH_SECRET;
                    break;
                case tokenTypeEnum.ACTION:
                    secret = JWT_ACTION_SECRET;
                    break;
                case tokenTypeEnum.FORGOT_PASSWORD:
                    secret = JWT_ACTION_FORGOT_PASSWORD_SECRET;
                    break;
                case tokenTypeEnum.ACTION_TOKEN:
                    secret = JWT_ACTION_TOKEN_SECRET;
                    break;
                default:
                    throw new ErrorHandler(statusCode.SERVER_ERROR, messageCode.WRONG_TOKEN);
            }

            await jwt.verify(token, secret);
        } catch (e) {
            throw new ErrorHandler(statusCode.UNAUTHORIZED, messageCode.NOT_TOKEN);
        }
    },
    createActionToken: () => jwt.sign({}, JWT_ACTION_SECRET, { expiresIn: '1d' }),
    generateActionTokenForPassword: () => jwt.sign({}, JWT_ACTION_FORGOT_PASSWORD_SECRET, { expiresIn: '24h' })
};
