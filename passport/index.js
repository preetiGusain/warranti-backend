const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const UserModel = require('../models/users');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    })
});

//Create a passport middleware to handle user registration
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                await UserModel.findOne({ email }, (err, user) => {
                    if (err) {
                        return done(err, null);
                    }
                    if (user) {
                        return done('User already exists', null);
                    }
                    user = new UserModel({
                        email,
                        password,
                    });
                    user = new UserModel({
                        email,
                        password,
                    });
                    user.save((err, user) => {
                        if (err) {
                            return done(err, null);
                        }
                        //delete user.password;
                        return done(null, user, { message: 'Sign up Successful' });
                    });
                });
            } catch (error) {
                done(error);
            }
        }
    )
);

//Google OAuth Strategy
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