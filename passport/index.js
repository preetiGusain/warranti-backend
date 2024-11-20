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
            console.log(profile);
            
            try {
                const userExistsWithGoogleId = await UserModel.findOne({
                    googleId: profile.id,
                });
                if(userExistsWithGoogleId) {
                    return done(null, userExistsWithGoogleId);
                }

                const userExistsWithGivenEmail = await UserModel.findOne({
                    email: profile?.emails[0]?.value,
                });
                if(userExistsWithGivenEmail) {
                    throw new Error('Login With Email/Password')
                }

                // Creating a new user if the user doesn't exist in db
                if (!userExistsWithGoogleId && !userExistsWithGivenEmail) {
                    const newUser = new UserModel({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        googleId: profile.id,
                        email: profile.email,
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