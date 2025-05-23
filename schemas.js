const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
 });

// Hash and salt passwords
userSchema.plugin(passportLocalMongoose);

// Helper db object
const User = mongoose.model("User", userSchema);

const blogPostSchema = new Schema({
    author: String,
    title: String,
    content: String,
    datetime: Date
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = {
    User,
    BlogPost
};