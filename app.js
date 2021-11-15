const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();

const {
    variablesConfig: {
        PORT, MONGO_CONNECT_URL, ALLOWED_ORIGIN, NODE_ENV
    }
} = require('./config');
const { userRouter, authRouter } = require('./routes');
const { statusCode, messageCode } = require('./config');
const { ErrorHandler } = require('./errors');
const { defaultDataUtil } = require('./utils');
const startCron = require('./cron');
const { swaggerJson } = require('./docs');

const app = express();

mongoose.connect(MONGO_CONNECT_URL);

app.use(helmet());
app.use(cors({ origin: _configureCors }));
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

if (NODE_ENV === 'dev') {
    const morgan = require('morgan');

    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

app.listen(PORT, () => {
    console.log(messageCode.RUNNING, PORT);
    defaultDataUtil();
    startCron();
});

function _notFoundError(err, req, res, next) {
    next({
        status: err.status || statusCode.NOT_FOUND,
        message: err.message || messageCode.NOT_FOUND
    });
}

// eslint-disable-next-line no-unused-vars
function _mainErrorHandler(err, req, res, next) {
    res
        .status(err.status || statusCode.SERVER_ERROR)
        .json({
            message: err.message
        });
}

function _configureCors(origin, callback) {
    if (NODE_ENV === 'dev') {
        return callback(null, true);
    }

    const writeList = ALLOWED_ORIGIN.split(';');

    if (!writeList.includes(origin)) {
        return callback(new ErrorHandler(402, 'Cors is not allowed'), false);
    }

    return callback(null, true);
}
