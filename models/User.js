const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose")
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    info: { type: String },
    date: { type: Date, default: Date.now },


})
UserSchema.plugin(passportLocalMongoose)

UserSchema.pre("save", function (next) {
    console.log("saved");
    next()
})

module.exports = mongoose.model("User", UserSchema)