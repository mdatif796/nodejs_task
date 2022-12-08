const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
});

const User = new mongoose.model('User', userSchema);

module.exports = User;