const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;


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
        callbackURL: `${process.env.BACKEND_URI}/oauth/google/callback`,
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);

            try {
                const userExistsWithGoogleId = await UserModel.findOne({
                    googleId: profile.id,
                });
                if (userExistsWithGoogleId) {
                    return done(null, userExistsWithGoogleId);
                }

                const userExistsWithGivenEmail = await UserModel.findOne({
                    email: profile?.emails[0]?.value,
                });
                if (userExistsWithGivenEmail) {
                    // If the email exists but not linked to Google, redirect them to login
                    return res.redirect(`${process.env.FRONTEND_URI}/login`);
                }

                // Creating a new user if the user doesn't exist in db

                const newUser = new UserModel({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    email: profile.emails[0]?.value,
                });
                await newUser.save();
                return done(null, newUser);

            } catch (error) {
                console.error('Error in Google OAuth Strategy:', error);
                return done(error);
            }
        }
    )
);