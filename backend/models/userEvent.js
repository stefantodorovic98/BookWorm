const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const userEventSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    dateBegin: { type: String, required: true },
    dateEnd: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('UserEvent', userEventSchema);
