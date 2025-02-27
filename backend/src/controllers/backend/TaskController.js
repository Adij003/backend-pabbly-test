const Task = require('../../models/Task');
const Logs = require('../../utils/Logs');
const Response = require('../../utils/Response')

// controller for creating a task
// @params {*} req
// @params {*} res

exports.createTask = async (req, res, next) => {
    try{

        const {title, description, priority, start_date, due_date, status} = req.body;
        const owner = req.owner;
        
        const existingTask = await Task.findOne({title, owner});
        if(existingTask){
            Logs.warn('Duplicate task title detected', owner, title );
            return res.status(400).json(Response.error('A task with this title already exists for the user'));            
        }
        
        const newTask = await Task.create({title, description, priority, start_date, due_date, status, owner});
        Logs.info('Task created successfully', {taskId: newTask._id})
        res.status(201).json(Response.success('Task created successfuly'));

    } catch (error) {

        next(error)


    }
}

// controller for getting all the tasks
// @params {*} req
// @params {*} res

exports.getAllTasks = async (req, res) => {
    try {

    } catch (error) {

    }
}

// controller for fetching a task
// @params {:id} req
// @params {*} res

exports.getTaskbyId = async (req, res) => {
    try{

    } catch (error) {

    }
}

exports.updateTask = async (req, res) => {
    try{

    } catch (error) {

    }
}

exports.deleteTask = async (req, res) => {
    try{

    } catch (error) {

    }
}
