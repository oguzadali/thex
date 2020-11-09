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

        console.log(req.params);

        if (!req.params.categoryId && !req.query.searchData) {
            prm = {}
            console.log("yok");
        } else {
            if (req.params.categoryId) {
                prm = { category: req.params.categoryId }
                queryL = latestPostsHelper(Post).populate({ path: "author", select: "username", model: User })
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

        let query = model.findById(req.params.id)

        let queryL = latestPostsHelper(Post)

        if (options && options.populate) {
            query = populateHelper(query, options.populate);
            queryL = populateHelper(queryL, options.populate);
        }

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