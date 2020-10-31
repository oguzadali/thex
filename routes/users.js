const express = require('express');
const session = require('express-session');
const router = express.Router()
const User = require('../models/User');
const passport = require("passport")

//LOGIN 
router.get('/login', function (req, res, next) {
    res.render("site/login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        // successMessage: "success authorizate",
        failureRedirect: "/users/login",
        // failureFlash: "Invalid username or password.Or error"
    }), (req, res) => { console.log(this.passport + "sss") })

//REGISTER 
router.get('/register', function (req, res, next) {
    res.render("site/register");
});

router.post("/register", (req, res) => {
    console.log(req.body);
    let newUser = new User({ username: req.body.username, email: req.body.email })
    User.register(newUser, req.body.password, (err, user) => {

        if (err) {
            console.log(err)

            res.redirect("/users/register")
        }
        console.log(this.user);
        passport.authenticate("local")(req, res, () => {
            res.redirect("/")
        })

    })
})



//LOGOUT 
router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect("/")

});




module.exports = router