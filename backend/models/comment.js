const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const commentSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    username: { type: String, required: true },
    idBook: { type: ObjectId, required: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String }
});

commentSchema.index({ "idUser": 1, "idBook": 1 }, { "unique": true });


commentSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Comment', commentSchema);
