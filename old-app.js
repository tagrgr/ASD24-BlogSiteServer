const express = require("express");
const bodyParser = require("body-parser");
// const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const loginRoutes = require("./routes/login");
const createAccountRoutes = require("./routes/create-accounts");
const blogPostsRoutes = require("./routes/blog-posts");
const passport = require("./config/passportConfig");

const PORT = 3000;
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/bestBlog")
.then(conn=> console.log(conn.models));

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//    username: String,
//    email: String,
// });



// Hash and salt passwords
// userSchema.plugin(passportLocalMongoose);

// Helper db object
// const User = mongoose.model("User", userSchema);

// const blogPostSchema = new Schema({
//     author: String,
//     title: String,
//     content: String,
//     datetime: Date
// });

// const BlogPost = mongoose.model("BlogPost", blogPostSchema);

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

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// const LocalStrategy = require("passport-local").Strategy;
// passport.use(new LocalStrategy(User.authenticate()));



// let blogPosts;
// let numPostsPerPage = 5;
// let numPagesToDisplay = 5;

function makeDummyPosts(numPosts, blogPosts) {
    for (let i=0; i<numPosts; i++) {
        blogPosts.push({
            author: "Author: " + i,
            title: "test" + i,
            content: "Text",
            datetime: new Date().toLocaleString()
        })
    }
}
// makeDummyPosts(98, blogPosts);

// Load all posts into the server memory on start
    // You don't need to query the database, which can take time
// BlogPost.find({search quesry}, {fields filter})
// BlogPost.find().then(foundPosts => {
//     console.log("Length of posts is: " + foundPosts.length);
//     blogPosts = foundPosts;
// });


// Fetch posts as the user requests them
    // Takes less RAM 

// Fetch posts as the user requests them, and keep them in memory for some time after
    // Caching

app.use("/", blogPostsRoutes);
// function getDisplayPosts(numPostsPerPage, pagenum, blogPosts) {
//     /*
//     pagenum = 1
//     posts 0-4

//     pagenum = 2
//     posts 5-9

//     pagenum = 10
//     posts (10-1)*5 - 10*5-1
//     45-49
//     */
//    let start = (pagenum-1)*numPostsPerPage;
//    let end = pagenum*numPostsPerPage;
//    return blogPosts.slice().reverse().slice(start, end);
// }

// app.get("/", (req, res) => {
//     // res.sendFile("index.html", {root: __dirname});
//     let pagenum;
//     if (!req.isAuthenticated()) {
//         res.redirect("/login");
//         return;
//     }
//     if (!req.query.pagenum) pagenum=1;
//     else pagenum = req.query.pagenum;
//     console.log(req.query.pagenum);
//     res.render("index.ejs", { 
//         blogPosts: getDisplayPosts(numPostsPerPage, pagenum, blogPosts),
//         numPages: Math.ceil(blogPosts.length/numPostsPerPage),
//         pagenum, // pagenum: pagenum
//         numPagesToDisplay
//     });
// });

// // app.get('/page', (req, res) => {
// //     res.render("index.ejs");
// // });

// app.post('/new-blog-post', (req, res) => {
//     if (!req.isAuthenticated()) {
//         res.redirect("/login");
//         return;
//     }
//     console.log(`Session user: ` + req.user.username);
//     console.log(req.body.author);
//     console.log(req.body.title);
//     console.log(req.body.content);
//     console.log(new Date().toLocaleString());
//     let blogPost = new BlogPost({
//         // update to req.user.username
//         author: req.body.author,
//         title: req.body.title,
//         content: req.body.content,
//         datetime: new Date()
//     });
//     blogPost.save()
//     .then(savedPost => {
//         // blogPosts.push({
//         //     savedPost
//         // });
//         blogPosts.push(
//             savedPost
//         );
//         console.log(savedPost);
//         console.log(savedPost.author);
//     })

//     // Save to DB first or save to array first?
//     res.redirect("/");
// });

app.use("/", createAccountRoutes);
// /create-account

// app.use("/2", createAccountRoutes);
// /2/create-account

// app.get('/create-account', (req, res) => {
//     if (req.isAuthenticated()) res.redirect("/?pagenum=1");
//     res.render("create-account.ejs");
// });

// app.post("/create-account", (req, res) => {
//     console.log(req.body);
//     if (req.isAuthenticated()) res.redirect("/?pagenum=1");
//     User.register(new User({
//         username: req.body.username,
//         email: req.body.email
//     }), req.body.password, (error, user) => {
//         if (error) console.log(error);
//         console.log("Created");
//         passport.authenticate("local", {failureRedirect: "/login2"})  (req, res, () => {
//             res.redirect("/?pagenum=1");
//         })
//     })
// });

app.use("/", loginRoutes);

// app.get('/login', (req, res) => {
//     if (req.isAuthenticated()) res.redirect("/?pagenum=1");
//     res.render("login.ejs");
// });

// app.post('/login', passport.authenticate('local', {failureRedirect: "/login"}), (req, res) => {
//     res.redirect("/?pagenum=1");
// })

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})


/*
    Data Models 
        - User
        - BlogPost
    Middleware Setup
    Configuration
    Test functions
    Server initialisation
    Routes
        - Blog posts
        - Create account
        - Login
*/

/*
    MVC - Model, View, Controller - Server architecture
    Model 
        - data
        - bridge between data and program
        - schemas.js
            - User, BlogPost
            - Create, Read, Update, Destroy (CRUD)
    View
        - UI
        - bridge between the client and the program
        - Routes

    Controller
        - Interatction between them
        - bridge between the model and the view
        - 
*/

/*
    Overall arctitecture
    Client-server
    - One server
    - Many clients
*/

/*
    Alternative atchitecture
    - Distributed system
        - Many clients
        - many servers
    - Parallel/distributed processing/computation
        - Many servers
        - One client
    - Peer-to-Peer
        - Torrent
*/

/*
    - David pays Gavan 50 btc
    - Gavan pays Amil 56 btc
    - Srecko mines for 0.5 btc
    - Timestamp
    - LastHash: xxxxxx

    - Current Hash: abs123
*/