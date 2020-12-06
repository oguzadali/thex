const path = require("path");
const root = path.dirname(require.main.filename);
// const errorWrapper = require(root + "/helpers/error/errorWrapper");
const errorWrapper = require("../../helpers/error/errorWrapper");
const Category = require('../../models/Category');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {
    latestPostsHelper,
    populateHelper,
    categorysHelper
} = require("./queryMiddlewares");



//get all posts with pagination
const indexQueryMiddleware = function (model, options) {
    return errorWrapper(async function (req, res, next) {
        // Initial Query
        const postPerPage = 8;
        const page = req.query.page || 1

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        let queryL
        let prm


        if (!req.params.slug && !req.query.searchData) {
            prm = {}
            // console.log("yok");
        } else {
            if (req.params.slug) {
                let cat = await Category.findOne({ slug: req.params.slug })
                let id = cat._id
                // console.log(await Post.find({ category: id }));

                prm = { category: id }
                queryL = latestPostsHelper(Post)
                console.log("category param");
            }
            else if (req.query.searchData) {
                const regex = new RegExp(escapeRegex(req.query.searchData), 'gi')

                console.log("sdata param");
                prm = { "title": regex }
                queryL = latestPostsHelper(Post)
            }
            else {
                console.log("no param");
            }

        }



        let query = model.find(prm)
        query.sort({ $natural: -1 })
            .skip((postPerPage * page) - postPerPage)
            .limit(postPerPage)

        if (options && options.populate) {
            query = populateHelper(query, options.populate);
        }

        let postcount = await model.countDocuments()

        const advanceQueryResults = await query;
        const advanceLatestQueryResults = await queryL;

        let categories = await categorysHelper(Category)

        res.d = {
            data: advanceQueryResults,
            current: parseInt(page),
            pages: Math.ceil(postcount / postPerPage),
            categories: categories,
            dataL: advanceLatestQueryResults,

        };

        next()
    })
}


//get single post with categories and latest posts
const postQueryMiddleware = function (model, options) {
    return errorWrapper(async function (req, res, next) {

        let query = await model.findOne({ slug: req.params.slug })
        // let query = await model.findById("5fa91b6fba923015f0ad0db3")



        let queryL = latestPostsHelper(Post)


        // if (options && options.populate) {
        //     query = populateHelper(query, options.populate);

        // }
        //its reurn promise
        query = query.populate({ path: "author", select: "username", model: User }).execPopulate()



        //get single posts
        const advanceQueryResults = await query;

        //get latest posts
        const advanceLatestQueryResults = await queryL;

        //get categories
        const categories = await categorysHelper(Category)

        res.d = {
            data: advanceQueryResults,
            dataL: advanceLatestQueryResults,
            categories: categories

        };
        next()
    })
}

const categoryQueryMiddleware = function (model, options) {
    return errorWrapper(async function (req, res, next) {
        //get categories
        const categories = await categorysHelper(Category)
        res.d = {
            categories: categories
        };
        next()
    })
}



module.exports = {
    indexQueryMiddleware,
    postQueryMiddleware,
    categoryQueryMiddleware

}