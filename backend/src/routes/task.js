const express = require('express');
const router = express.Router()
const {validateTaskId, validateTask} = require('../utils/Validator')
const TaskController = require('../controllers/backend/TaskController');
const handleValidationError = require('../middlewares/handleValidationError');


// create taks route
router.post('/', validateTask, handleValidationError,TaskController.createTask);

router.get('/', TaskController.getAllTasks)

router.get('/:id', validateTaskId, handleValidationError, TaskController.getTaskbyId)

router.put('/:id', validateTaskId, handleValidationError, TaskController.updateTask)

router.delete('/:id', validateTaskId, handleValidationError, TaskController.deleteTask)

module.exports = router;
