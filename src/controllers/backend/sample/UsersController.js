const Users = require('../../models/Users');
const Logs = require('../../utils/Logs');
const Response = require('../../utils/Response');
const Helper = require('../../utils/Helper');
const { validationResult, param, body } = require('express-validator');


module.exports = {

    /**
     * This method is use for retrieve a single record.
     * @param {*} req 
     * @param {*} res 
     * @returns Users
     */
    getOne: async (req, res) => {
        try {

            // Define your validation rules here
            const validationRules = [
                param('user_id', 'Invalid user ID').custom(Helper.isValidObjectId)
            ];

            // Run the validation rules
            await Promise.all(validationRules.map(async rule => await rule.run(req)));

            // Get validation errors
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error("Fields are required.", errors.array()[0]));
            }

            const userId = req.params.user_id;

            const user = await Users.findById(userId);

            if (!user) {
                throw "User not found!";
            }

            return res.json(Response.success("Get User", user));
        } catch (err) {
            Logs.error(err);
            res.status(400).json(Response.error(err));
        }
    },

    /**
     * This method is use to update the single record.
     * @param {*} req 
     * @param {*} res 
     * @returns Users
     */
    updateOne: async (req, res) => {
        try {

            // Define your validation rules here
            const validationRules = [
                param('user_id', 'Invalid user ID').notEmpty().custom(Helper.isValidObjectId),
                body('username').optional().escape(),
                body('email').optional().isEmail().withMessage('Invalid email address').escape(),
                body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            ];

            // Run the validation rules
            await Promise.all(validationRules.map(async rule => await rule.run(req)));

            // Get validation errors
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error("Fields are required.", errors.array()[0]));
            }

            const userId = req.params.user_id;

            const { username, email, password } = req.body;

            if (!username && !email && !password) {
                throw "Atleast one of the field is required username, email or password."
            }

            let updateFields = {}

            if (email) {
                // Check if the provided email already exists
                let existingUser = await Users.findOne({ _id: { $ne: userId }, email });
                if (existingUser) {
                    throw "User with this email already exists";
                }

                updateFields.email = email;
            }

            if (username) {
                updateFields.username = username;
            }

            if (password) {
                updateFields.password = password;
            }

            const updatedUser = await Users.findByIdAndUpdate(userId, updateFields, { new: true });


            if (!updatedUser) {
                throw "User not found!";
            }

            return res.json(Response.success("User updated successfully", updatedUser));
        } catch (err) {
            Logs.error(err);
            res.status(500).json(Response.error(err));
        }
    },

    /**
     * This method is use to fetch all the user record.
     * @param {*} req 
     * @param {*} res 
     * @returns Users
     */
    getAll: async (req, res) => {
        try {

            const users = await Users.find({});

            return res.json(Response.success("All users", users));
        } catch (err) {
            Logs.error(err);
            res.status(500).json(Response.error(err));
        }
    },

    /**
     * This method is use to delete a single record.
     * @param {*} req 
     * @param {*} res 
     * @returns Users
     */

    deleteOne: async (req, res) => {
        try {

            // Define your validation rules here
            const validationRules = [
                param('user_id', 'Invalid user ID').custom(Helper.isValidObjectId)
            ];

            // Run the validation rules
            await Promise.all(validationRules.map(async rule => await rule.run(req)));

            // Get validation errors
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error("Fields are required.", errors.array()[0]));
            }

            const userId = req.params.user_id;

            const deletedUser = await Users.findByIdAndDelete(userId);

            if (!deletedUser) {
                throw "User not found!";
            }

            // Destroy the current session
            req.session.destroy((err) => {
                if (err) {
                    Logs.error(err);
                }
            });

            return res.json(Response.success("Get User", deletedUser));
        } catch (err) {
            Logs.error(err);
            res.status(500).json(Response.error(err));
        }
    },

}