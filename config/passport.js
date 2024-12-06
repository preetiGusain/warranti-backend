const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/users');
require("dotenv").config();

//Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/oauth/google/callback",
            scope: ["profile", "email", "displayName"],
        },
        function(accessToken, refreshToken, profile, cb) {
            //console.log(accessToken, refreshToken, profile)
            console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
            return cb(null, profile)
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id); // Fetch user by id from MongoDB
        done(null, user); // Pass the user object to the next middleware
    } catch (error) {
        console.log('Error in deserilizeUser:', error);
        done(error, null);
    }
});