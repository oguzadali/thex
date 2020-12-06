const Post = require("../models/Post");
const Category = require('../models/Category');
const User = require('../models/User');
const { slugHelper } = require("../helpers/slug")
const errorWrapper = require("../helpers/error/errorWrapper.js");
const CustomError = require("../helpers/error/customError");

//Get Categorys
const getAdminCategories = errorWrapper(async (req, res, next) => {
    const hbsSecureDataforCategories = {
        categories: res.d.categories.map(d => {
            return {
                name: d.name,
                id: d._id,
            }
        })
    }

    res.render("admin/categories", {
        categorys: hbsSecureDataforCategories.categories,
    });
});

//Delete Categories
const deleteCategories = errorWrapper(async (req, res, next) => {
    // console.log(req.params.id);
    await Category.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect("/admin/categories")
    })
    next()

});

//ADD NEW CATEGORY
const addNewCategory = errorWrapper(async (req, res, next) => {
    console.log(req.body);
    let slug = slugHelper(req.body.name)
    console.log(slug);
    Category.create({ ...req.body, slug: slug }, (err, category) => {
        if (err) {
            console.log(err, "category post err:", 12);
        }
        console.log(category);
    })

    res.redirect("/admin/categories");

});


//GET ADMIN POSTS
const getAllPostsAdmin = errorWrapper(async (req, res, next) => {

    const hbsSecureData = {
        posts: res.d.data.map(d => {
            return {
                title: d.title,
                subtitle: d.subtitle,
                imageurl: d.imageurl,
                date: d.date,
                id: d._id,
                author: d.author.username,
                c_id: d.category._id
            }
        })
    }
    res.render("admin/posts", {
        posts: hbsSecureData.posts,
        current: res.d.current,
        pages: res.d.pages,

    });
    // next()
})

//DELETE POST
const deletePost = errorWrapper(async (req, res, next) => {

    console.log(req.params.id);
    await Post.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect("/admin/blogs")
    })
    next()

});


//GET POST IN EDITOR WITH CATEGORY
const getAdminSinglePostAndCategories = errorWrapper(async (req, res, next) => {
    const post = res.d.data
    const hbsSecureData = {
        id: post._id,
        title: post.title,
        subtitle: post.subtitle,
        imageurl: post.imageurl,
        content: post.content,
        date: post.date,
        file: post.file,
        author: post.author.username
    }


    const hbsSecureDataforCategories = {
        categories: res.d.categories.map(d => {
            return {
                name: d.name,
                id: d._id,
            }
        })
    }



    res.render("admin/editpost", {
        post: hbsSecureData,
        categorys: hbsSecureDataforCategories.categories,


    });
    // next()
})

//EDIT POST
const editPost = errorWrapper(async (req, res, next) => {
    const form = req.body.data
    Post.findByIdAndUpdate(req.params.id).populate({ path: "author", select: "username", model: User })
        .populate({ path: "category", select: "name", model: Category })
        .then(documents => {
            // console.log(documents);

            documents.title = form.title,
                documents.slug = slugHelper(form.title),
                documents.subtitle = form.subtitle,
                documents.imageurl = form.imageurl,
                documents.content = form.content,
                documents.author = documents.author,
                documents.category = form.category,

                documents.save()
                    .then(documents => {
                        res.redirect("/admin/blogs")
                    })
        })
})

module.exports = {
    getAdminCategories,
    deleteCategories,
    addNewCategory,
    getAllPostsAdmin,
    deletePost,
    getAdminSinglePostAndCategories,
    editPost

};