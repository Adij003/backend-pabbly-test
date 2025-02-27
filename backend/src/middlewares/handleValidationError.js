const { validationResult } = require('express-validator');
const Response = require('../utils/Response')

module.exports = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(Response.error('Validation failed', errors.array()))
    }
    next()
}