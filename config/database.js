const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DEV_DB_STRING, {});
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = connectDB;