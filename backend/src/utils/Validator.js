const { body, param } = require('express-validator');

exports.validateTask = [
    body('title')
        .trim()
        .exists({ checkFalsy: true }).withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .escape(),

    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .escape(),

    body('priority')
        .notEmpty().withMessage('Priority is required')
        .isIn(["low", "medium", "high"]).withMessage('Priority must be one of: low, medium, high'),

    body('start_date')
        .optional()
        .isISO8601().withMessage('Start date must be a valid ISO8601 date'),

    body('due_date')
        .notEmpty().withMessage('Due date is required')
        .isISO8601().withMessage('Due date must be a valid ISO8601 date'),

    body('status')
        .optional()
        .isIn(["pending", "completed", "in_progress"]).withMessage('Status must be one of: pending, completed, in_progress'),

    
];

exports.validateTaskId = [
    param('id')
    .isMongoId().withMessage('Task id must be a valid mongodb id')
]