const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const UserModel = require('../models/users');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        console.log('Error in deserilizeUser:', error);
        done(error, null);
    }
});

//Passport middleware to handle user registration
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                // Check if the user already exists
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    return done('User already exists', null);
                }

                // Create a new user
                const user = new UserModel({
                    email,
                    password,
                });

                await user.save();
                return done(null, user, { message: 'Signed up successfully' });
            } catch (error) {
                console.error('Error in signing up:', error);
                return done(error, null);
            }
        }
    )
);

//Passport middleware to handle User login
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done('Email or Password not valid', false);
                }
                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done('Email or Password not valid', false);
                }
                return done(null, user, { message: 'Logged in success' });
            } catch (error) {
                return done(error);
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
        callbackURL: "http://localhost:3000/oauth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const currentUser = await UserModel.findOne({
                    googleId: profile.id,
                });
                // Creating a new user if the user doesn't exist in db
                if (!currentUser) {
                    const newUser = await new UserModel({
                        username: profile.username || 'defaultUsername',
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
    )
);

//facebook oauth
passport.use(
    'facebook',
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: '/oauth/facebook/callback',
            profileFields: ['email', 'name', 'id'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const currentUser = await UserModel.findOne({
                    facebookId: profile.id,
                });
                // create new user if the db
                if (!currentUser) {
                    const newUser = await new UserModel({
                        facebookId: profile.id,
                        email: profile._json.last_name,
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
    )
);