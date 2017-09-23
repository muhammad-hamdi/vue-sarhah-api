const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, reqiured: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    image_url: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
