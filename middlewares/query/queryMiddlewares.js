

//((HELPERS))
const populateHelper = (query, populate) => {
    return query.populate(populate);

};

const latestPostsHelper = (model) => {
    const lim = 4
    return model.find()
        .sort({ $natural: -1 })
        .limit(lim)
};

const categorysHelper = (model) => {
    return model.find().sort({ "name": 1 })
}




const getPaginatorVariables = async (req, total) => {

    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;



    const pagination = {}
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    return {
        pagination,
        startIndex,
        limit
    }
}


const paginationHelper = async (model, query, req) => {
    const total = await model.countDocuments();

    const { pagination, startIndex, limit } = await getPaginatorVariables(
        req,
        total);

    return {
        query: query.skip(startIndex).limit(limit),
        pagination: Object.keys(pagination).length === 0 ? undefined : pagination
    };
}

const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {

        queryObject = {};

        const regex = new RegExp(req.query.search, "i");
        queryObject[searchKey] = regex;

        return query.where(queryObject);

    }
    return query;
}


const questionSortHelper = (query, req) => {

    const sortKey = req.query.sortBy;

    return query.sort("-createdAt");
}



module.exports = {

    latestPostsHelper,
    categorysHelper,
    populateHelper
};