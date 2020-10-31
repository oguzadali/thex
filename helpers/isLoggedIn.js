const express = require("express")

router = express.Router()

function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/users/login")

}
module.exports = {
    isloggedIn
}