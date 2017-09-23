const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {type: String, reqiured: true},
    sender_id: String,
    receiver_id: String,
    createdAt: Date,
    name: String,
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
