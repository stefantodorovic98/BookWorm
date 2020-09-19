const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const followSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    username: { type: String, required: true },
    whomFollows: { type: ObjectId, required: true },
    whomUsername: { type: String, required: true }
});

followSchema.index({ "idUser": 1, "whomFollows": 1 }, { "unique": true });


followSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Follow', followSchema);
