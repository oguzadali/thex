const moment = require('moment');

function generateDate(date,format){
    return moment(date).format(format)
}

module.exports={
    generateDate
}