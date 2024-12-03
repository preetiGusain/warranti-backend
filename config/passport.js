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
            callbackURL: `${process.env.BACKEND_URI}/oauth/google/callback`,
            scope: ["profile", "email", "displayName"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // If the user exists, update their Google ID and profile information
                    user.googleId = profile.id;
                    user.username = profile.displayName;
                    user.profilePicture = profile.photos[0].value;
                    await user.save();
                    return done(null, user);
                } else {
                    // If the user doesn't exist, create a new user
                    const newUser = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        profilePicture: profile.photos[0].value,
                    });
                    user = await newUser.save();
                    return done(null, user);
                }
            } catch (error) {
                return done(error, false);
            }
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