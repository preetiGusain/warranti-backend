const express = require('express');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const checkEnvVariables = require('dotenv-verifier');
const connectDB = require('./config/db');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const { checkLogin } = require('./controllers/auth/checkLogin');

dotenv.config();
const requiredVariables = ['PORT', 'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'FRONTEND_URI'];
checkEnvVariables(requiredVariables);

const app = express();
const PORT = process.env.PORT;

connectDB();
require('./passport');

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URI,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

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

app.get('/protected', checkLogin, (req, res) => {
    res.redirect(`${process.env.FRONTEND_URI}/dashboard`);
    res.send('Hello');
});

//Handle Errors
app.use(function (error, req, res, next) {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});