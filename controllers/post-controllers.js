const Post = require("../models/Post");
const Category = require('../models/Category');
const User = require('../models/User');

const errorWrapper = require("../helpers/error/errorWrapper.js");
const CustomError = require("../helpers/error/customError");

//index operations
const getAllPostsAndCategories = errorWrapper(async (req, res, next) => {

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
    const hbsSecureDataforCategories = {
        categories: res.d.categories.map(d => {
            return {
                name: d.name,
                id: d._id,
            }
        })
    }


    let latestPostDatas;
    if (res.d.dataL) {
        latestPostDatas = {
            data: res.d.dataL.map(a => {
                return {
                    title: a.title,
                    imageurl: a.imageurl,
                    id: a._id,
                    date: a.date
                }
            })
        }

    } else {
        latestPostDatas = {
            data: []
        }
    }

    res.render("site/blog", {
        posts: hbsSecureData.posts,

        categorys: hbsSecureDataforCategories.categories,
        latestPosts: latestPostDatas.data,
        current: res.d.current,
        pages: res.d.pages,

    });
    // next()
})


//single post page
const getSinglePostAndCategories = errorWrapper(async (req, res, next) => {
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

    let latestPostDatas

    if (res.d.dataL) {
        latestPostDatas = {
            data: res.d.dataL.map(a => {
                return {
                    title: a.title,
                    imageurl: a.imageurl,
                    id: a._id,
                    date: a.date
                }
            })
        }
    } else {
        latestPostDatas = {}
    }


    res.render("site/post", {
        post: hbsSecureData,
        categorys: hbsSecureDataforCategories.categories,
        latestPosts: latestPostDatas.data || latestPostDatas

    });
    // next()
})


//NEW POST
const addNewPost = errorWrapper(async (req, res, next) => {

    const form = req.body.data
    Post.create({
        ...form,
        author: res.locals.currentUserId
    })
    next()

});

//Get Categorys
const getCategories = errorWrapper(async (req, res, next) => {
    const hbsSecureDataforCategories = {
        categories: res.d.categories.map(d => {
            return {
                name: d.name,
                id: d._id,
            }
        })
    }
    res.render("site/addpost", {
        categorys: hbsSecureDataforCategories.categories,
    });
});



module.exports = {
    getAllPostsAndCategories,
    getSinglePostAndCategories,
    addNewPost,
    getCategories,

};