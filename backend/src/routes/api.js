const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/api/ApiController');

router.get('/sample', ApiController.sample);

const taskRoutes = require('./api-routes/task-routes')

router.use('/tasks', taskRoutes)

module.exports = router;