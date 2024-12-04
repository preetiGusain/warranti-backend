const express = require('express');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const checkEnvVariables = require('dotenv-verifier');
import cookieParser from 'cookie-parser';
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const bcrypt = require("bcryptjs");
const localStrategy = require('passport-local').Strategy;
const User = require('./models/users');

dotenv.config();
const requiredVariables = ['PORT', 'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'FRONTEND_URI'];
checkEnvVariables(requiredVariables);

const app = express();
const PORT = process.env.PORT;

connectDB();
require('./config/passport');

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URI,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    })
);
app.use(cookieParser());

//Passport configuration
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
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in the session
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

//Middleware
app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Session management
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
            ttl: 24 * 60 * 60, // 1 day
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());



//Backend Routes
app.use('/auth', require('./routes/auth'));
app.use('/oauth', require('./routes/oauth'));

// //Warranty Routes
// app.use('/warrantyRoutes', require('./routes/warrantyRoutes'));

//Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend server running' });
});

app.get('/user/profile', async (req, res) => {
    console.log("request object", req);
    try {
      if (req.user) {
        return res.json({ user: req.user });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});