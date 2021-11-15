const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayJs.extend(utc);

const { OAuth } = require('../dataBase');

module.exports = async () => {
    const previousMonth = dayJs.utc().subtract(1, 'month');

    const deleteInfo = await OAuth.deleteMany({
        createdAT: { $gt: previousMonth }
    });

    console.log(deleteInfo);
};
