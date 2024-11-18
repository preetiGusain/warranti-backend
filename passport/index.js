const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const UserModel = require('../models/users');

passport.use(
    'google',
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const currentUser = await UserModel.findOne({
                    googleId: profile.id,
                });
                // Creating new user if the user doesn't exist in db
                if (!currentUser) {
                    const newUser = await new UserModel({
                        googleId: profile.id,
                        email: profile._json.email,
                    }).save();
                    if (newUser) {
                        done(null, newUser);
                    }
                }
                done(null, currentUser);
            } catch (error) {
                return done(error);
            }
        }
    ));