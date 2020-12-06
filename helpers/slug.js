
const urlSlug = require('url-slug');

const slugHelper = (header) => {
    return urlSlug(header, {
        transformer: urlSlug.transformers.lowercase
    })
}

module.exports = {
    slugHelper
}








