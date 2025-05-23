const passport = require("passport");
const { User } = require("../schemas");
// const schemas = require("../schemas");
// const User = schemas.User


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

module.exports = passport;