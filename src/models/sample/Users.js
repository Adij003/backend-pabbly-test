const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Helper = require('../utils/Helper');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

// Hash the password before saving
userSchema.pre('save', function (next) {
    const user = this;
    const saltRounds = 10;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// Pre-update middleware to hash password before updating
userSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (!update.password) {
        // If password is not being updated, proceed to next middleware
        return next();
    }

    // Hash the new password before updating
    bcrypt.hash(update.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        // Update the password with the hashed value
        update.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;