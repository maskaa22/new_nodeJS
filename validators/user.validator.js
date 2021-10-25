const Joi = require('joi');

const {
    constantsGerexpConfig: { EMAIL_REGEXP, PASSWORD_REGESP, NAME_REGEXP }
} = require('../config');
const { userRolesEnumConfig } = require('../config');

const createUserValidator = Joi.object({
    name: Joi.string().alphanum().regex(NAME_REGEXP)
        .trim()
        .required(),
    password: Joi.string().regex(PASSWORD_REGESP).required(),
    email: Joi.string().regex(EMAIL_REGEXP).required(),
    role: Joi.string().allow(...Object.values(userRolesEnumConfig))
});

const updateUserValidator = Joi.object({
    name: Joi.string().alphanum().regex(NAME_REGEXP)
        .trim()
        .required()
});

module.exports = {
    createUserValidator,
    updateUserValidator
};
