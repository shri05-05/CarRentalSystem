const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String // 'user' or 'owner'
});

module.exports = mongoose.model('User', userSchema);
