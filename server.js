const express = require('express');
const cors = require('cors');
const checkEnvVariables = require('dotenv-verifier');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const passport = require('passport');
const useragent = require('express-useragent');

dotenv.config();
const requiredVariables = ['PORT', 'MONGO_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'FRONTEND_URI', 'JWT_SECRET', 'JWT_COOKIE_EXPIRE', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
checkEnvVariables(requiredVariables);
connectDB();

const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(useragent.express());


require('./config/passport');

//Root endpoint
app.get('/keep-alive', (req, res) => {
    console.log("keep-alive");
    res.json({ message: 'Backend server running' });
});

//Backend Routes
app.use('/auth', require('./routes/auth'));
app.use('/oauth', require('./routes/oauth'));
app.use('/user', require('./routes/user'));
app.use('/warranty', require('./routes/warranty'))

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});