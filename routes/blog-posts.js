const express = require("express");
const { BlogPost } = require("../schemas");
const { 
    NUM_POSTS_PER_PAGE,  
    NUM_PAGES_TO_DISPLAY
} = require("../config/config");

const router = express.Router();

let blogPosts;

BlogPost.find().then(foundPosts => {
    console.log("Length of posts is: " + foundPosts.length);
    blogPosts = foundPosts;
});

function getDisplayPosts(numPostsPerPage, pagenum, blogPosts) {
    /*
    pagenum = 1
    posts 0-4

    pagenum = 2
    posts 5-9

    pagenum = 10
    posts (10-1)*5 - 10*5-1
    45-49
    */
   let start = (pagenum-1)*numPostsPerPage;
   let end = pagenum*numPostsPerPage;
   return blogPosts.slice().reverse().slice(start, end);
}

router.get("/", (req, res) => {
    // res.sendFile("index.html", {root: __dirname});
    let pagenum;
    if (!req.isAuthenticated()) {
        res.redirect("/login");
        return;
    }
    if (!req.query.pagenum) pagenum=1;
    else pagenum = req.query.pagenum;
    console.log(req.query.pagenum);
    res.render("index.ejs", { 
        blogPosts: getDisplayPosts(NUM_POSTS_PER_PAGE, pagenum, blogPosts),
        numPages: Math.ceil(blogPosts.length/NUM_POSTS_PER_PAGE),
        pagenum, // pagenum: pagenum
        numPagesToDisplay: NUM_PAGES_TO_DISPLAY
    });
});

// app.get('/page', (req, res) => {
//     res.render("index.ejs");
// });

router.post('/new-blog-post', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
        return;
    }
    console.log(`Session user: ` + req.user.username);
    console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(new Date().toLocaleString());
    let blogPost = new BlogPost({
        // update to req.user.username
        author: req.user.username,
        title: req.body.title,
        content: req.body.content,
        datetime: new Date()
    });
    blogPost.save()
    .then(savedPost => {
        // blogPosts.push({
        //     savedPost
        // });
        blogPosts.push(
            savedPost
        );
        console.log(savedPost);
        console.log(savedPost.author);
    })

    // Save to DB first or save to array first?
    res.redirect("/");
});

module.exports = router;