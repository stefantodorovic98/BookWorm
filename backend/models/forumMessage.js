const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const forumMessageSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    username: { type: String, required: true },
    idEvent: { type: ObjectId, required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model('ForumMessage', forumMessageSchema);