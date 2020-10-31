const mongoose = require("mongoose")

const connect2db = () => {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        .then(() => {
            console.log("\x1b[33mMONGODB CONNECTED  ***!! \x1b[0m")
        })
        .catch(err => {
            console.log("\x1b[31m Connect2db ERR !?!  \x1b[0m", err)
        })
}


module.exports = connect2db