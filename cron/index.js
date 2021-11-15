const cron = require('node-cron');

const removeOldToken = require('./olt-token-remove.cron');

module.exports = () => {
    cron.schedule('*/10 * * * * *', async () => {
        console.log('Cron start');
        await removeOldToken();
    });
};
