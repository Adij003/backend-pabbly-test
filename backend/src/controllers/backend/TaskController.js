const Task = require('../../models/Task');
const Logs = require('../../utils/Logs');
const Response = require('../../utils/Response')
const mongoose = require('mongoose')

// controller for creating a task
// @params {*} req
// @params {*} res

exports.createTask = async (req, res, next) => {
    try {

        const { title, description, priority, start_date, due_date, status } = req.body;
        const owner = req.owner;

        const existingTask = await Task.findOne({ title, owner });
        if (existingTask) {
            Logs.warn('Duplicate task title detected', owner, title);
            return res.status(400).json(Response.error('A task with this title already exists for the user'));
        }

        const newTask = await Task.create({ title, description, priority, start_date, due_date, status, owner });
        Logs.info('Task created successfully', { taskId: newTask._id })
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


exports.getAllTasks = async (req, res, next) => {

    try {

        const owner = new mongoose.Types.ObjectId(req.owner); // Extract owner ID from middleware
        Logs.info('Fetching tasks for user', { owner });
        // Extract query parameters for filtering, sorting, and pagination
        const { 
            title, 
            priority, 
            status, 
            sort_by = 'createdAt', 
            sort_order = 'asc', 
            page = 1, 
            limit = 10,
            latest_query_date,
            last_total_task
        } = req.query;

        // Validate and sanitize query inputs
        const filters = { owner }; // Always filter by the logged-in user's tasks
        if (title) filters.title = { $regex: title, $options: 'i' }; // Case-insensitive title search
        if (priority) filters.priority = priority; // Filter by priority if provided
        if (status) filters.status = status; // Filter by status if provided

        //convert pagination and sorting inputs
        const sortOption = { [sort_by]: sort_order === 'desc' ? 1 : 1 }; // Ascending or descending sort 
        const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1);
        const itemsPerPage = Math.min(Math.max(limit, 1), 100);
        // Limit results to a maximum of 100 per page

        const latestTask = await Task.findOne({owner}).sort({ createdAt: -1})

        // determine whether the total tasks need to be calculated or not
        let calculateTotalCount = true;
        if(latest_query_date && latestTask && latestTask.createdAt <= new Date(latest_query_date) && (last_total_task)){
            calculateTotalCount = false;
        }

        const pipeline = [
            { $match: filters},
            { $sort: sortOption },
            { $skip: skip},
            { $limit: itemsPerPage}
        ]

        // Add totalCount facet conditionally

        const facets = { data: pipeline };
        if(calculateTotalCount){
            facets.totalCount = [
                { $match: filters},
                { $count: "count"}
            ]
        }

        const result = await Task.aggregate([{ $facet: facets}]);

        const tasks = result[0].data || [];
        let totalCount = 0;

        if(calculateTotalCount){
            totalCount = result[0].totalCount?.[0]?.count || 0;
        } else if (tasks.length === 0){
            totalCount = 0
        } else {
            totalCount = parseInt(last_total_task, 10) || 10
        }

        const totalPages = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 1;

        // Fetch tasks from the database
        // const tasks = await Task.find(filters)
        //     .sort(sortOption)
        //     .skip(skip)
        //     .limit(itemsPerPage);
        // // Count total tasks for the logged-in user matching the filters
        // const totalTasks = await Task.countDocuments(filters);

        const response = {
            tasks,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalTasks: totalCount,
                itemsPerPage
            },
            latestQueryDate: latestTask.createdAt

        }

        // Logs.info('Task fetched successfully ', { owner, filters, sortOption, pagination: response.pagination });
        return res.status(200).json(Response.success('Task fetched successfully', response));
    } catch (error) {
        Logs.error('Error fetching tasks', error)
        next(error)
    }

}

// Controller for create bulk task
exports.createBulkTasks = async (req, res, next) => {
    try {
        const { tasks } = req.body; // Expecting tasks as an array in the request 
        const owner = new mongoose.Types.ObjectId(req.owner); // Extract owner ID from middleware
        Logs.info('Bulk task creation initiated', { owner, taskCount: tasks.length });
        // Validate input
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return res.status(408).json(Response.error('No tasks provided or invalid format.'));
        }
        // Attach the owner ID to each task and validate required fields
        const tasksToInsert = tasks.map((task) => {
            if (!task.title || !task.due_date) {
                throw new Error('Each task must have a title and a due_date')
            }
            return { ...task, owner }
        });

        // Insert tasks into the database
        const insertedTasks = await Task.insertMany(tasksToInsert);
        Logs.info('Bulk task creation successful', { owner, insertedCount: insertedTasks.length });
        res.status(201).json(Response.success('Tasks created successfully', insertedTasks));
    } catch (err) {
        Logs.error('Error during bulk task creation', err); next(err); // Pass to the error handler middleware
        next(err)
    }
}

exports.getTaskbyId = async (req, res, next) => {
    try {
        const owner = new mongoose.Types.ObjectId(req.owner);
        Logs.info('Fetching task by ID', {taskId: req.params.id, owner});
        const task = await Task.findOne({_id: req.params.id, owner}); 
        console.log('one task is', task)
        return res.status(200).json(Response.success('Task fetched successfully', task));
    } catch (error) {
        Logs.error('Error taskById ', error); // Pass to the error handler middleware

        next(error)
    }
}

exports.updateTaskById = async (req, res, next) => {
    try {
        const { title, description, priority, start_date, due_date, status } = req.body;
        const owner = new mongoose.Types.ObjectId(req.owner); // Validate and convert owner to ObjectId

        Logs.info('Updating task', { taskId: req.params.id, owner });

        // Check for duplicate task title (excluding the current task being updated)
        const existingTask = await Task.findOne({ title, owner, _id: { $ne: req.params.id } });

        if (existingTask) {
            Logs.warn('Duplicate task title detected during update', { owner, title });
            return res.status(400).json(Response.error('A task with this title already exists for the user')); 
        }

        // Update task
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, owner },
            { title, description, priority, start_date, due_date, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            Logs.warn('Task not found during update', { taskId: req.params.id, owner });
            return res.status(404).json(Response.error('Task not found'));
        }

        Logs.info('Task updated successfully', { taskId: updatedTask._id });
        return res.status(200).json(Response.success('Task updated successfully', updatedTask));

    } catch (error) {
        Logs.error('Error updating task', error);
        next(error);
    }
};


exports.deleteTask = async (req, res, next) => {
    try {
        const owner = new mongoose.Types.ObjectId(req.owner); // Convert owner to ObjectId
        const taskId = req.params.id;

        Logs.info('Deleting task', { taskId, owner });

        // Find and delete the task
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, owner });

        if (!deletedTask) {
            Logs.warn('Task not found during deletion', { taskId, owner });
            return res.status(404).json(Response.error('Task not found'));
        }

        Logs.info('Task deleted successfully', { taskId: req.params.id });
        return res.status(200).json(Response.success('Task deleted successfully', deletedTask));

    } catch (error) {
        Logs.error('Error deleting task', error);
        next(error);
    }
};


exports.getTaskStats = async (req, res, next) => {
    try{
        const ownerId = new mongoose.Types.ObjectId(req.owner); // Convert owner to ObjectId
        Logs.info('getting task stats', { ownerId });

        const stats =  await Task.aggregate([
            { $match: { owner: ownerId}},
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1}
                }
            }
        ])

        const formattedData = stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});

        return res.status(200).json(Response.success('Task stats fetched successfully', formattedData))

    } catch (error) {
        // logging the errors
        Logs.error('Error deleting task', error);
        next(error);
    }
}