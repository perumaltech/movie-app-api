require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoute');

const app = express();

const port = process.env.PORT;

// Middleware
// app.use(cors({
//     origin: ['http://localhost:3000'], // or your client domain
//     credentials: true,
// }));

app.use(cors())
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
