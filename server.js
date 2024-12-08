const express = require('express');
const cors = require('cors');
const checkEnvVariables = require('dotenv-verifier');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const requiredVariables = ['PORT', 'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'FRONTEND_URI', 'JWT_SECRET', 'JWT_COOKIE_EXPIRE', 'SUPABASE_URL', 'SUPABASE_KEY'];
checkEnvVariables(requiredVariables);
connectDB();

const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


require('./config/passport');

//Backend Routes
app.use('/auth', require('./routes/auth'));
app.use('/oauth', require('./routes/oauth'));
app.use('/user', require('./routes/user'));
app.use('/warranty', require('./routes/warranty'))

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});