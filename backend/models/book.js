const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    authors: { type: String, required: true },
    issueDate: { type: String, required: true },
    genres: { type: String, required: true },
    description: { type: String, required: true },
    allowed: { type: String, required: true }
});


module.exports = mongoose.model('Books', bookSchema);