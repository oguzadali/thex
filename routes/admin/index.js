const express = require('express');
const isLoggedIn = require('../../helpers/isLoggedIn').isloggedIn;
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');

const { categoryQueryMiddleware, indexQueryMiddleware, postQueryMiddleware } = require('../../middlewares/query/postQuery');

const { getAdminCategories, deleteCategories,
    addNewCategory, getAllPostsAdmin, deletePost,
    getAdminSinglePostAndCategories, editPost } = require('../../controllers/admin-controllers');


const router = express.Router()

//GENERAL ADMİN ROUTE (SESSION CONTROL)
router.get('/', isLoggedIn, (req, res, next) => {
    res.render("admin/index")

});


//>>>> ADMIN CATEGORY OPS
router.get('/categories', isLoggedIn, categoryQueryMiddleware(), getAdminCategories)

router.delete('/categories/:id', deleteCategories)

router.post("/categories", isLoggedIn, addNewCategory)


//>>>> ADMIN POST OPS
//GET POSTS IN ADMIN/BLOGS
router.get('/blogs', isLoggedIn, indexQueryMiddleware(Post), getAllPostsAdmin)

//DELETE POST
router.delete('/blogs/:id', isLoggedIn, deletePost)

//GET POST TO UPDATE FORM-
router.get('/blogs/edit/:id', isLoggedIn, postQueryMiddleware(Post), getAdminSinglePostAndCategories)

//UPDATE POST 
router.post("/blogs/edit/:id", isLoggedIn, editPost)


module.exports = router