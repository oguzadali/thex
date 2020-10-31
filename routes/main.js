const express = require('express');
const router = express.Router()
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');

//MAIN PARTS
router.get('/', function (req, res, next) {
    // console.log(req.session);
    // console.log(res.locals);
    res.render("site/index");
});

router.get('/about', function (req, res, next) {
    res.render("site/about");
});

//GET LATEST POSTS
router.get('/blog', (req, res) => {
    const postPerPage = 8;
    const page = req.query.page || 1
    Post.find()
        .sort({ $natural: -1 })
        .skip((postPerPage * page) - postPerPage)
        .limit(postPerPage)

        .populate({ path: "author", select: "username", model: User })
        .populate({ path: "category", select: "name", model: Category })
        .then(documents => {
            // console.log(documents);
            const context = {
                posts: documents.map(document => {
                    // console.log(document);
                    return {
                        title: document.title,
                        subtitle: document.subtitle,
                        imageurl: document.imageurl,
                        // content: document.content,
                        date: document.date,
                        id: document._id,
                        // file: document.file,
                        author: document.author.username,
                        c_id: document.category._id
                    }
                })
            }
            //get post count
            Post.countDocuments().then(postcount => {
                // console.log(`total post count; ${postcount}`);
                // console.log(context.posts);
                Category.aggregate([{
                    $lookup: {
                        from: "posts",
                        localField: "_id",
                        foreignField: "category",
                        as: "posts"
                    }
                }, {
                    $project: {
                        _id: 1,
                        name: 1,
                        num_of_posts: { $size: "$posts" }
                    }
                }
                ])
                    // .find().sort({ $natural: -1 })
                    .then(documents => {
                        // console.log(documents);
                        const categorys = {
                            cats: documents.map((d) => {
                                return {
                                    name: d.name,
                                    id: d._id,
                                    count: d.num_of_posts
                                }
                            })
                        }

                        const lim = 4
                        Post.find()
                            .sort({ $natural: -1 })
                            .limit(lim)
                            .populate({ path: "author", select: "username", model: User })
                            .populate({ path: "category", select: "name", model: Category }).then((d) => {
                                const latestPostDatas = {
                                    data: d.map(a => {
                                        return {
                                            title: a.title,
                                            imageurl: a.imageurl,
                                            id: a._id,
                                            date: a.date
                                        }
                                    })
                                }
                                // console.log(latestPostDatas);
                                res.render("site/blog", {
                                    posts: context.posts,
                                    categorys: categorys.cats,
                                    latestPosts: latestPostDatas.data,
                                    current: parseInt(page),
                                    pages: Math.ceil(postcount / postPerPage)
                                });


                            }).catch(error => res.status(500).send(error))
                    })
            })
        }).catch(error => res.status(500).send(error))

})


module.exports = router