const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

let blogPosts = [];

app.get("/", (req, res) => {
    // res.sendFile("index.html", {root: __dirname});
    res.render("index.ejs", { blogPosts });
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

})