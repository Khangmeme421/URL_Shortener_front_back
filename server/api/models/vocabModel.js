const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
    original_link: { type: String, required: true },
    shortened_link: { type: String,  required: true},
    expires_at: { type: String,  required: true},
    last_clicked: { type: String,  required: true},
    click_count : { type: Number,  required: true},
    created_by_ip : { type: String,  required: true}
} ,
{collection:'link'} // schema is the collection in db

);

module.exports = mongoose.model('link', vocabSchema);
