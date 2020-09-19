const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

const inviteEventSchema = mongoose.Schema({
    idEvent: { type: ObjectId, required: true },
    idHost: { type: ObjectId, required: true },
    idGuest: { type: ObjectId, required: true },
    text: { type: String, required: true },
    hostInvitation: { type: String, required: true },
    userRequest: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('InviteEvent', inviteEventSchema);
