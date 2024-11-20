const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');

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

                const username = email.split('@')[0];
                if (!username) {
                    return done('Invalid username', null);
                }
                const existingUsername = await UserModel.findOne({ username });
                if (existingUsername) {
                    return done('Username already taken', null);
                }

                // Create a new user
                const user = new UserModel({
                    username,
                    email,
                    password,
                    googleId: uuidv4(),
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
                    let username = profile.username || profile.displayName || profile._json.email.split('@')[0];

                    let existingUsername = await UserModel.findOne({ username });
                    while (existingUsername) {
                        // If the username exists, generate a new unique one (e.g., appending a number or a random string)
                        username = `${username}${Math.floor(Math.random() * 1000)}`;
                        existingUsername = await UserModel.findOne({ username });
                    }

                    const newUser = new UserModel({
                        username,
                        googleId: profile.id,
                        email: profile._json.email,
                    });
                    await newUser.save();
                    return done(null, newUser);
                }
                return done(null, currentUser);
            } catch (error) {
                console.error('Error in Google OAuth Strategy:', error);
                return done(error);
            }
        }
    )
);