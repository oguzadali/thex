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

const userQueryMiddleware = function (model) {

    return errorWrapper(async function (req, res, next) {
        Post.countDocuments().then(postcount => {
            console.log(`total post count; ${postcount}`);
            // console.log(context.posts);
            User.aggregate([{
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author",
                    as: "posts"
                }
            }, {
                $project: {
                    _id: 1,
                    username: 1,
                    num_of_posts: { $size: "$posts" }
                }
            }, { $sort: { num_of_posts: -1 } }])
                .then(documents => {
                    // console.log(documents);
                    const categorys = {
                        cats: documents.map((d) => {
                            return {
                                username: d.username,
                                id: d._id,
                                count: d.num_of_posts
                            }
                        })
                    }
                    res.render("admin/users", {
                        users: categorys.cats
                    })
                    // console.log(categorys.cats);
                })
        })
    })

}


const duserQueryMiddleware = function (model) {

    return errorWrapper(async function (req, res, next) {

        let postCount = Post.countDocuments()
        let userWithCount = User.aggregate([{
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "author",
                as: "posts"
            }
        }, {
            $project: {
                _id: 1,
                username: 1,
                num_of_posts: { $size: "$posts" }
            }
        }, { $sort: { num_of_posts: -1 } }])
        res.d = {
            d1: postCount,
            d2: userWithCount,
        };
        const hbsSecureData = {
            posts: res.d.map(d => {
                console.log(d);
            })
        }


        console.log(res.d);
        console.log("uuuuuu");
        next()




        // Post.countDocuments().then(postcount => {
        //     console.log(`total post count; ${postcount}`);
        //     // console.log(context.posts);
        //     User.aggregate([{
        //         $lookup: {
        //             from: "posts",
        //             localField: "_id",
        //             foreignField: "author",
        //             as: "posts"
        //         }
        //     }, {
        //         $project: {
        //             _id: 1,
        //             username: 1,
        //             num_of_posts: { $size: "$posts" }
        //         }
        //     }, { $sort: { num_of_posts: -1 } }])
        //         .then(documents => {
        //             // console.log(documents);
        //             const categorys = {
        //                 cats: documents.map((d) => {
        //                     return {
        //                         username: d.username,
        //                         id: d._id,
        //                         count: d.num_of_posts
        //                     }
        //                 })
        //             }
        //             console.log(categorys.cats);
        //         })
        // })



    })

}

// userQueryMiddleware()






module.exports = {
    registerQueryMiddleware,
    userQueryMiddleware,


}