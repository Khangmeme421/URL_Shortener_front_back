const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
    original_link: { type: String, required: true },
    shortened_link: { type: String,  required: true},
} ,
{collection:'link'} // schema is the collection in db

);

module.exports = mongoose.model('link', vocabSchema);
