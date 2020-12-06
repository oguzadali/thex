const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    // info: { type: String, required: true },
    // date: { type: Date, default: Date.now },
    // file:{ type:String ,required:false },

})
module.exports = mongoose.model("Category", CategorySchema)