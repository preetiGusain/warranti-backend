const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const compression = require('compression');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
require('./passport');

//Middleware
app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

//Session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'Our secret.',
        resave: false,
        saveUninitialized: false,
        maxAge: 24 * 60 * 60 * 100, //Cookie expiration
    })
);

app.use(passport.initialize());
app.use(passport.session());


//Backend Routes
app.use('/signup', require('./routes/api/signup'));
app.use('/login_check', require('./routes/api/check_login'));
app.use('/login', require('./routes/api/login'));
app.use('/logout', require('./routes/api/logout'));
app.use('/oauth', require('./routes/api/oauth'));

//Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend server running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});