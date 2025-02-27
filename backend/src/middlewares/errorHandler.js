const Response = require('../utils/Response');
const Logs = require('../utils/Logs')

module.exports = (err, req, res, next) => {
    // err handler

    if(!err){
        return next();
    }

    const { method, originalUrl } = req;
    Logs.error(`Unhandled error is in ${method} ${originalUrl}`, err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json(Response.error(message))
}