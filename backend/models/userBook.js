const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userBookSchema = mongoose.Schema({
    idUser: { type: ObjectId, required: true },
    idBook: { type: ObjectId, required: true },
    read: { type: String, required: true },
    wait: { type: String, required: true },
    currRead: { type: String, required: true },
    currPage: { type: Number, required: true },
    maxPage: { type: Number, required: true },
    statusMessage: { type: String, required: true }
});

userBookSchema.index({ "idUser": 1, "idBook": 1 }, { "unique": true });


userBookSchema.plugin(uniqueValidator);


module.exports = mongoose.model('UserBooks', userBookSchema);