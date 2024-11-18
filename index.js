const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Connect to the database
connectDB();

//Middleware
app.use(express.json());

//Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/protected', (req, res) => {
    res.send('Hello!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});