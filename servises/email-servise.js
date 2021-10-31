const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const path = require('path');

const { variablesConfig: { NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASSWORD }, messageCode, statusCode } = require('../config');
const allTemplates = require('../emails-templates');
const { ErrorHandler } = require('../errors');

const templateParses = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'emails-templates')
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secureConnection: false,
    port: 587,
    // requiresAuth: true,
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_EMAIL_PASSWORD
    }
});

const sendMail = async (userMail, emailAction, context = {}) => {
    const templateInfo = allTemplates[emailAction];

    if (!templateInfo) {
        throw new ErrorHandler(statusCode.NOT_ACCEPTABLE, messageCode.WRONG_TEMPLATE);
    }

    const html = await templateParses.render(templateInfo.templateName, context);

    return transporter.sendMail({
        from: NO_REPLY_EMAIL,
        to: userMail,
        subject: templateInfo.subject,
        html
    });
};

module.exports = {
    sendMail
};
