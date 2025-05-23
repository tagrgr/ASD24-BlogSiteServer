const express = require("express");
const passport = require("../config/passportConfig");

const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) res.redirect("/?pagenum=1");
    res.render("login.ejs");
});

router.post('/', passport.authenticate('local', {failureRedirect: "/login"}), (req, res) => {
    res.redirect("/?pagenum=1");
})

module.exports = router;