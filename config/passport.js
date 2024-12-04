const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy

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

//Local strategy
passport.use(
    new localStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password" });
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

var opts = {}
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};
opts.secretOrKey = process.env.SESSION_SECRET;
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    console.log("JWT BASED  VALIDATION GETTING CALLED")
    console.log("JWT", jwt_payload)
    const user = await User.findOne({ email: jwt_payload.data.email });
    if (user) {
        return done(null, user)
    } else {
        // user account doesnt exists in the DATA
        return done(null, false);
    }
}));

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