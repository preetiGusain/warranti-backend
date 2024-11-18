const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/api/signup');
const connectDB = require('./config/db');
const passport = require('passport');

dotenv.config();
const app = express();

connectDB();
require('./passport');

//Middleware
app.use(express.json());

//Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/protected', (req, res) => {
    res.send('Hello!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});