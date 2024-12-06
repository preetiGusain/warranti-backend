const express = require('express');
const cors = require('cors');
const checkEnvVariables = require('dotenv-verifier');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const passport = require('passport');
const { userAuthorized } = require('./middleware/userAuth.js');

dotenv.config();
const requiredVariables = ['PORT', 'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'FRONTEND_URI', 'JWT_SECRET', 'JWT_COOKIE_EXPIRE'];
checkEnvVariables(requiredVariables);
connectDB();

const app = express();
app.use(cors({origin: process.env.FRONTEND_URI,methods: 'GET,POST,PUT,DELETE',credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


require('./config/passport');

//Backend Routes
app.use('/auth', require('./routes/auth'));
app.use('/oauth', require('./routes/oauth'));

app.use(userAuthorized);
app.use('/user', require('./routes/user'));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});