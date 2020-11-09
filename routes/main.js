const express = require('express');
const router = express.Router()
const asyncErrorWrapper = require("express-async-handler")
const CustomError = require('../helpers/error/CustomError');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const { indexQueryMiddleware, categoryQueryMiddleware } = require('../middlewares/query/postQuery');
const { getAllPostsAndCategories, getAllCategories } = require('../controllers/post-controllers');

//MAIN PARTS
router.get('/', function (req, res, next) {
    res.render("site/index");
});

router.get('/about', function (req, res, next) {
    res.render("site/about");
});


router.get('/blog', indexQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getAllPostsAndCategories)



module.exports = router