const express = require('express');
const router = express.Router()


const main = require("./main")
const posts = require("./posts");
const users = require("./users");
const contact = require("./contact");
const admin = require("./admin/index")


//use static files /making public of  statics
router.use("/", main)
router.use("/posts", posts)
router.use("/users", users)
router.use("/admin", admin)
router.use("/contact", contact)

module.exports = router;