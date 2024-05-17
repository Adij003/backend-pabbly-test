const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/ApiController');

router.get('/sample', ApiController.sample);

module.exports = router;