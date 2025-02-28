const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per 15 minutes
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Use `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

module.exports = apiRateLimiter;
