const {
    emailActionEnum: {
        WELCOME, ORDER_CONFIRMED, USER_BLOCKED, DELETE, UPDATE, FORGOT_PASSWORD
    }
} = require('../config');

module.exports = {
    [WELCOME]: {
        templateName: 'welcome',
        subject: 'Welcome !!!'
    },
    [ORDER_CONFIRMED]: {
        templateName: 'order.corfirmed',
        subject: 'Cool !!!'
    },
    [USER_BLOCKED]: {
        templateName: 'us-b',
        subject: 'Cool !!!'
    },
    [DELETE]: {
        templateName: 'delate',
        subject: 'Delete is OK'
    },
    [UPDATE]: {
        templateName: 'update',
        subject: 'Update is OK'
    },
    [FORGOT_PASSWORD]: {
        templateName: 'forgot-password',
        subject: 'Forgot something.'
    }
};
