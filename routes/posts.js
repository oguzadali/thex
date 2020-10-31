const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post');
const Category = require("../models/Category")
const User = require('../models/User');
const { Router } = require('express');
const { isloggedIn } = require('../helpers/isLoggedIn');

//new and newpost test --add ckeditor in test addpost hbs
router.get('/new', isloggedIn, (req, res, next) => {

    Category.find().sort({ $natural: -1 }).then(documents => {
        const categorys = {
            cats: documents.map((d) => {
                return {
                    name: d.name,
                    id: d._id
                }
            })
        }
        res.render("site/addpost", { categorys: categorys.cats });
    })

});


router.post('/new', function (req, res, next) {
    // console.log(req.session.userId);
    let title = req.body.data.title
    let subtitle = req.body.data.subtitle
    let content = req.body.data.content
    let imageurl = req.body.data.imageurl
    let category = req.body.data.category
    // console.log(res.locals.currentUserId);

    //we cut add file part because file-upload form 
    //operations are not work
    //for save img file path and name 
    // let file_img = req.body.data.file
    // file_img.mv(path.resolve(__dirname, "../public/img/file_imgs", file_img.name))

    Post.create({
        title: title,
        subtitle: subtitle,
        content: content,
        imageurl: imageurl,
        category: category,
        // file: `/img/file_imgs/${file_img.name}`,
        author: res.locals.currentUserId
    })
    // console.log(req.files.file);
    // req.session.sessionFlash = {
    //     type: 'alert alert-success',
    //     message: 'added successfully'
    // }
    // res.redirect("/blog")
});

router.get("/category/:categoryId", async (req, res) => {
    // console.log(req.params.categoryId);
    await Post.find({ category: req.params.categoryId }).populate({ path: "category", model: Category })
        .populate({ path: "author", select: "username", model: User })
        .then(documents => {
            const context = {
                posts: documents.map(document => {
                    // console.log(document);
                    return {
                        title: document.title,
                        subtitle: document.subtitle,
                        imageurl: document.imageurl,
                        content: document.content,
                        date: document.date,
                        id: document._id,
                        file: document.file,
                        author: document.author.username,
                        c_id: document.category._id
                    }
                })
            }
            // console.log(`documents ${documents}`);
            // console.log(`contexte.posts ${context.posts}`);
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
            ]).then(documents => {
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
                        res.render("site/blog", { posts: context.posts, categorys: categorys.cats, latestPosts: latestPostDatas.data })

                    }).catch(error => res.status(500).send(error))





                // res.render("site/blog", { posts: context.posts, categorys: categorys.cats });
            })


        }).catch(error => res.status(500).send(error))
})


//POST SEARCHS
router.get('/search', (req, res, next) => {
    // console.log("aa");
    // console.log(req.query.data);
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    if (req.query.data) {
        const regex = new RegExp(escapeRegex(req.query.data), 'gi'); // g mean is get all results;i mean is modifier?
        Post.find({ "title": regex })
            .populate({ path: "author", select: "username", model: User })
            .populate({ path: "category", select: "name", model: Category })
            .sort({ $natural: -1 })
            .then(documents => {
                // console.log(documents);
                const context = {
                    posts: documents.map(document => {
                        // console.log(document);
                        return {
                            title: document.title,
                            subtitle: document.subtitle,
                            imageurl: document.imageurl,
                            content: document.content,
                            date: document.date,
                            id: document._id,
                            file: document.file,
                            author: document.author.username,
                            c_id: document.category._id
                        }
                    })
                }
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
                        // console.log(categorys.cats);
                        // console.log(context.posts);
                        res.render("site/blog", { posts: context.posts, categorys: categorys.cats });
                    })
            }).catch(error => res.status(500).send(error))
    } else {
        console.log("no data");
    }
});

//GET SINGLE POST
router.get('/:id', (req, res) => {

    //THIS PART CREATED FOR GET SINGLE BLOG DATA WITH ID
    Post.findById(req.params.id).populate({ path: "author", select: "username", model: User }).then(documents => {
        // console.log(documents);
        var context = {
            id: documents._id,
            title: documents.title,
            subtitle: documents.subtitle,
            imageurl: documents.imageurl,
            content: documents.content,
            date: documents.date,
            file: documents.file,
            author: documents.author.username
        }
        //THIS PART IS CREATED FOR GET CATEGORIES AND THEIR COUNTS
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
                // console.log(categorys.cats);
                // console.log(context.posts);

                //THIS PART IS CREATED  FOR GET LATEST POSTS DATA
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
                        res.render("site/post", { post: context, categorys: categorys.cats, latestPosts: latestPostDatas.data })

                    }).catch(error => res.status(500).send(error))








            })//
        // console.log(context.author);
        // res.render("site/post", { post: context });
    }).catch(error => res.status(500).send(error))
})

module.exports = router