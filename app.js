require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoute');

const app = express();

const port = process.env.PORT || 5000;


// Configure CORS to allow any origin, any header, and any method
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], // Allow all headers
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    })
    .catch(err => console.log(err));
