const express = require('express');
const session = require('express-session');
const path = require('path');
const isLoggedIn = require('../../helpers/isLoggedIn').isloggedIn;
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');

const router = express.Router()

//GENERAL ADMİN ROUTE (SESSION CONTROL)
router.get('/', isLoggedIn, (req, res, next) => {
    res.render("admin/index")

});


//CATEGORIES 
router.get('/categories', async (req, res) => {
    await Category.find().sort({ $natural: -1 }).then(documents => {
        // console.log(documents);
        const categorys = {
            cats: documents.map((d) => {
                // console.log(d.name);
                return {
                    name: d.name,
                    id: d._id
                }
            })
        }
        // console.log(categorys.cats);
        // const ul = categorys.cats
        // for (let index = 0; index < ul.length; index++) {
        //     const element = ul[index];
        //     console.log(element);
        // }
        res.render("admin/categories", { categorys: categorys.cats });

    }).catch(error => res.status(500).send(error))
})

router.delete('/categories/:id', async (req, res, next) => {
    // console.log(req.params.id);
    await Category.remove({ _id: req.params.id }).then(() => {
        res.redirect("/admin/categories")
    })
    next()
})

router.post("/categories", (req, res) => {
    // console.log(req.body);
    Category.create(req.body, (err, category) => {
        if (err) {
            console.log(err, "category post err:", 12);
        }
        // console.log(category);
    })
    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'registered successfully'
    }
    res.redirect("/admin/categories");
})


//>>>> ADMIN POST OPS
//GET POSTS IN ADMIN/BLOGS
router.get('/blogs', async (req, res) => {
    await Post.find().populate({ path: "author", select: "username", model: User })
        .populate({ path: "category", select: "name", model: Category })
        .sort({ $natural: -1 }).then(documents => {
            // console.log(documents);
            const context = {
                posts: documents.map(document => {
                    // console.log(document.category.name);
                    return {
                        title: document.title,
                        subtitle: document.subtitle,
                        imageurl: document.imageurl,
                        content: document.content,
                        date: document.date,
                        id: document._id,
                        file: document.file,
                        author: document.author.username,
                        category: document.category.name
                    }
                })
            }
            // console.log(context.posts);
            res.render("admin/posts", { posts: context.posts });
        }).catch(error => res.status(500).send(error))
})

//DELETE POST
router.delete('/blogs/:id', async (req, res, next) => {
    console.log(req.params.id);
    await Post.remove({ _id: req.params.id }).then(() => {
        res.redirect("/admin/blogs")
    })
    next()
})




//GET POST TO UPDATE FORM---GET
router.get('/blogs/edit/:id', async (req, res) => {
    // console.log(req.params.id);
    await Post.findById(req.params.id).populate({ path: "author", select: "username", model: User })
        .populate({ path: "category", select: "name", model: Category })
        .then(documents => {
            // console.log(documents);
            var context = {
                title: documents.title,
                subtitle: documents.subtitle,
                imageurl: documents.imageurl,
                content: documents.content,
                date: documents.date,
                file: documents.file,
                id: documents._id,
                // author: documents.author.username,
                // category: documents.category._id
            }
            console.log(context.id);
            Category.find().sort({ $natural: -1 }).then(documents => {
                const categorys = {
                    cats: documents.map((d) => {
                        return {
                            name: d.name,
                            id: d._id
                        }
                    })
                }
                res.render("admin/editpost", { post: context, categorys: categorys.cats });
            })
            // console.log(context.title);
            // res.render("site/post", { post: context });
        }).catch(error => res.status(500).send(error))
})

//UPDATE POST 
router.post("/blogs/edit/:id", (req, res) => {
    // let file_img = req.files.file
    // file_img.mv(path.resolve(__dirname, "../../public/img/file_imgs", file_img.name))
    // console.log(req.params.id);
    //or use findById
    Post.findByIdAndUpdate(req.params.id).populate({ path: "author", select: "username", model: User })
        .populate({ path: "category", select: "name", model: Category })
        .then(documents => {
            // console.log(documents);

            documents.title = req.body.data.title,
                documents.subtitle = req.body.data.subtitle,
                documents.imageurl = req.body.data.imageurl,
                documents.content = req.body.data.content,
                // documents.file = `/img/file_imgs/${file_img.name}`,

                documents.author = documents.author,

                documents.category = req.body.data.category,
                documents.save().then(documents => {
                    res.redirect("/admin/blogs")
                })
            // console.log(documents);
            // console.log(req.body.data);
        }).catch(error => res.status(500).send(error))
})


module.exports = router