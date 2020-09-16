const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const notificationSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    idBook: { type: ObjectId, required: true },
    text: { type: String, required: true },
    read: { type: String, required: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
