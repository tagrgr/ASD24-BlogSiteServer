const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);

const PORT = 3000;
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/bestBlog")
.then(conn=> console.log(conn.models));

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
});

// Hash and salt the password
// Use the passport-local-mongoose plugin to add username and password fields
userSchema.plugin(passportLocalMongoose);

// Helper db object
// const db = mongoose.connection;
const User = mongoose.model("User", userSchema);

// Manage authentication and cookies
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        mongoURL: "mongodb://127.0.0.1:27017",
        collection: "bestBlog"
    }, error => console.log(error))
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

let blogPosts = [];
let numPostsPerPage = 5;
let numPagesToDisplay = 5;

function makeDummyBlogPosts(numPosts, blogPosts) {
    for (let i = 0; i < numPosts; i++) {
        blogPosts.push({
            author: "Author: " + i,
            title: "TEST" + i,
            content: "Text",
            datetime: new Date().toLocaleString()
        })
    }
}
makeDummyBlogPosts(98, blogPosts);

function getDisplayPosts(numPostsPerPage, pagenum, blogPosts) {
    /*
    pagenum = 1
    posts 0-4
    
    pagenum = 2
    posts 5-9

    pagenum = 10
    posts (10-1)*5 - (10*5-1)
    45-49
    */ 
   let start = (pagenum - 1) * numPostsPerPage;
   let end = pagenum * numPostsPerPage;
   return blogPosts.slice().reverse().slice(start, end);
}

app.get("/", (req, res) => {
    // res.sendFile("index.html", {root: __dirname});
    let pagenum;
    if (!req.query.pagenum) pagenum = 1; // default to page 1
    else pagenum = req.query.pagenum;
    console.log(req.query.pagenum);
    res.render("index.ejs", { 
        blogPosts: getDisplayPosts(numPostsPerPage, pagenum, blogPosts),
        numPages: Math.ceil(blogPosts.length / numPostsPerPage),
        pagenum, // same as pagenum: pagenum
        numPagesToDisplay
     });
});

// app.get("/page", (req, res) => {
//     res.render("index.ejs");
// });

app.post('/new-blog-post', (req, res) => {
    console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(new Date().toLocaleString());
    blogPosts.push({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        datetime: new Date().toLocaleString()
    })
    res.redirect("/");
});

app.get('/create-account', (req, res) => {
    if (req.isAuthenticated()) res.redirect("/pagenum=1");
    res.render("create-account.ejs");
    });

app.post("/create-account", (req, res) => {
    console.log(req.body);
    if (req.isAuthenticated()) res.redirect("/pagenum=1");
    User.register(new User({
        username: req.body.username,
        email: req.body.email
    }), req.body.password, (error, user) => {
        if (error) console.log(error);
        console.log("Created");
        passport.authenticate("local", {failureRedirect: "/login2"})(req, res, () => {
            res.redirect("/?pagenum=1");
        })
    })
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/pagenum=1");
    res.render("login.ejs");
});

app.post('/login', passport.authenticate('local', {failureRedirect: "/login"}), (req, res) => {
    res.redirect("/?pagenum=1");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

})