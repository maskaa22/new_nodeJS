const nodemailer = require('nodemailer');

const { variablesConfig: { NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASSWORD } } = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_EMAIL_PASSWORD
    }
});

const sendMail = (userMail) => transporter.sendMail({
    from: 'No replay',
    to: userMail,
    subject: 'Hello World',
    html: 'HELLO WORLD99999'
});

module.exports = {
    sendMail
};
