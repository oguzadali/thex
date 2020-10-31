const express = require('express')
const path = require('path');//used for connect html in express
const favicon = require('serve-favicon'); //used for fav.ico
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session')

const localStrategy = require("passport-local")
const passport = require("passport")
const User = require('./models/User');

// const fs = require('fs')
const morgan = require('morgan')

const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')(session)
const generateDate = require('./helpers/generateDate').generateDate;
const limiter = require("./helpers/limitGetPost").limit
const truncate = require("./helpers/limitGetText").truncate
const paginate = require("./helpers/paginate").paginate


const app = express()
const port = 3000

app.use(methodOverride('_method'))

//file up
app.use(fileUpload())

const hbs = exphbs.create({
    helpers: {
        generateDate: generateDate,
        limiter: limiter,
        truncate: truncate,
        paginate: paginate
    },
})


app.use(express.static("public"))
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(favicon(path.join(__dirname, "./public/lighting.ico")))

//MORGAN LOGGER
app.use(morgan('tiny'))

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(morgan('dev', { stream: accessLogStream }))



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://adminnn1:789695aa@firstmongo.8zt1w.mongodb.net/node_clean_blog_2?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("mongodb connected  ***!!")
})
    .catch(err => {
        console.log(err)
    })

app.use(require("express-session")({
    secret: " secret word",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate(), function (username, password, done) {
    User.findOne(
        { username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
                console.log(message);
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
                console.log(message);
            }
            return done(null, user);

        })
}))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//share current user info within all routes
app.use((req, res, next) => {

    if (req.user) {
        res.locals.currentUser = req.user.username;
        res.locals.currentUserId = req.user._id;
        // console.log(currentUserId);
        // console.log(res.locals.currentUserId);
    }
    next()
})


const main = require("./routes/main")
const posts = require("./routes/posts");
const users = require("./routes/users");
const contact = require("./routes/contact");
const admin = require("./routes/admin/index")


//use static files /making public of  statics
app.use("/", main)
app.use("/posts", posts)
app.use("/users", users)
app.use("/admin", admin)
app.use("/contact", contact)



app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`)
})