const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post');
const Category = require("../models/Category")
const User = require('../models/User');

const { isloggedIn } = require('../helpers/isLoggedIn');
const { indexQueryMiddleware, postQueryMiddleware, categoryQueryMiddleware } = require('../middlewares/query/postQuery');
const { getAllPostsAndCategories, getSinglePostAndCategories, addNewPost, getCategories } = require('../controllers/post-controllers');


//ADD ARTICLE 
router.get('/new', isloggedIn, categoryQueryMiddleware(), getCategories);

router.post('/new', isloggedIn, addNewPost);

//GET CATEGORY RELATED POSTS
router.get('/category/:slug', indexQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getAllPostsAndCategories)

//POST SEARCHS
router.get('/search', indexQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getAllPostsAndCategories)


//GET SINGLE POST
router.get('/:slug', postQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getSinglePostAndCategories)

router.get('/ccategory/:slug', async (req, res, next) => {
    console.log(req.params);
    let cat = await Category.findOne({ slug: req.params.slug })
    let id = cat._id
    console.log(await Post.find({ category: id }));
    // console.log(await Category.findOne({ slug: req.params.slug })
    console.log(id);
    // .populate({ path: "author", select: "username", model: User })

    // Post.find({slug:"slug"})
    res.status(200)
        .json({
            success: true,
            message: "oke",

        });
    //    'pandemi-uzay-internet-yarisini-hizlandiriyor'

})


router.get("/t/:slug", async (req, res, next) => {
    console.log(req.params);
    console.log(await Post.findOne({ slug: req.params.slug }).populate({ path: "author", select: "username", model: User }));
    // Post.find({slug:"slug"})
    res.status(200)
        .json({
            success: true,
            message: "oke",

        });
    //    'pandemi-uzay-internet-yarisini-hizlandiriyor'

})
const as = async () => {

    console.log(await Post.find({ slug: 'pandemi-uzay-internet-yarisini-hizlandiriyor' }));
}
// as()

module.exports = router