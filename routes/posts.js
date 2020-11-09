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
router.get('/category/:categoryId', indexQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getAllPostsAndCategories)


//POST SEARCHS
router.get('/search', indexQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getAllPostsAndCategories)


//GET SINGLE POST
router.get('/:id', postQueryMiddleware(Post,
    { populate: { path: "author", select: "username", model: User } }), getSinglePostAndCategories)


module.exports = router