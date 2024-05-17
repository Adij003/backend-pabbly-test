const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Define routes

/**
 * This routes are for only developemnt
 */
if (process.env.ENVIRONMENT === "development") {
    router.post('/signin', AuthController.signin);
    router.post('/signup', AuthController.signup);
}

router.get('/tauth', AuthController.tokenAuth);

router.get('/logout', AuthController.logout);

module.exports = router;