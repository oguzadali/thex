module.exports = {
    paginate: (options) => {
        // console.log(options);
        let outputHTML = ""
        if (options.hash.current === 1) {
            outputHTML += ` <li class="page-item disabled"><a class="page-link" href="#">First</a></li>`

        } else {
            outputHTML += ` <li class="page-item "><a class="page-link" href="?page=1">First</a></li>`
        }
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 3 : 1);
        if (i !== 1) {
            outputHTML += ` <li class="page-item "><a class="page-link" href="?page=1">...</a></li>`
        }
        for (; i <= (Number(options.hash.current) + 3) && i <= options.hash.pages; i++) {
            if (i === options.hash.current) {
                outputHTML += ` <li class="page-item active"><a class="page-link" href="?page">${i}</a></li>`
            } else {
                outputHTML += ` <li class="page-item "><a class="page-link" href="?page=${i}">${i}</a></li>`
            }
            if (i == Number(options.hash.current) + 3 && i < options.hash.pages) {
                outputHTML += ` <li class="page-item "><a class="page-link" href="?page=">...</a></li>`
            }
        }
        if (options.hash.current == options.hash.pages) {
            outputHTML += ` <li class="page-item disabled"><a class="page-link" href="?page">Last</a></li>`
        } else {
            outputHTML += ` <li class="page-item "><a class="page-link" href="?page=${options.hash.pages}">${i}</a></li>`
        }

        return outputHTML
    }
}