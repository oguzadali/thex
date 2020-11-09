const errorWrapper = require("../../helpers/error/errorWrapper");
const Category = require('../../models/Category');
const User = require('../../models/User');
const Post = require('../../models/Post');
const passport = require("passport")


const registerQueryMiddleware = function (model) {

    return errorWrapper(async function (req, res, next) {
        console.log(req.body);
        let newUser = new User({ username: req.body.username, email: req.body.email })
        User.register(newUser, req.body.password, (err, user) => {

            if (err) {
                console.log(err)

                res.redirect("/users/register")
            }

            passport.authenticate("local")(req, res, () => {
                res.redirect("/")
            })

        })

        // next()
    })
}



module.exports = {
    registerQueryMiddleware,


}