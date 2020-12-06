const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: { type: String, require: true },
    subtitle: { type: String, require: true },
    slug: { type: String, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", require: true },
    imageurl: { type: String, require: true },
    content: { type: String, require: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categories", require: true },
    date: { type: Date, default: Date.now },
    // file: { type: String, require: false },

})
module.exports = mongoose.model("Post", PostSchema)