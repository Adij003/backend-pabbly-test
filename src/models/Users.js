const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    api: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;