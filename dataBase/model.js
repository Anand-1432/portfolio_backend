const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        require: true,
        type: String,
    },
    email: {
        require: true,
        type: String,
    },
    message: {
        type: Array,
        require: true,
    }
});

const User = new mongoose.model("user", userSchema);

module.exports = User;