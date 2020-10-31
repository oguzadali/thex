const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose")
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    // info: { type: String, required: true },
    date: { type: Date, default: Date.now },
    // file:{ type:String ,required:false },

})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)