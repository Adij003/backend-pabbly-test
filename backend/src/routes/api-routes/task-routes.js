const express = require('express');
const router = express.Router()
const {validateTaskId, validateTask, validateBulkTask} = require('../../utils/Validator')
const TaskController = require('../../controllers/backend/TaskController');
const handleValidationError = require('../../middlewares/handleValidationError');


// create taks route
router.get('/stats', TaskController.getTaskStats);


router.post('/', validateTask, handleValidationError,TaskController.createTask);

router.get('/', TaskController.getAllTasks)

router.get('/:id', validateTaskId, handleValidationError, TaskController.getTaskbyId)

router.put('/:id', validateTaskId, handleValidationError, TaskController.updateTaskById)

router.delete('/:id', validateTaskId, handleValidationError, TaskController.deleteTask)

router.post('/bulk', validateBulkTask, handleValidationError,TaskController.createBulkTasks);


module.exports = router;
