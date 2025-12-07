const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const trekRoutes = require('./routes/treks');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/treks', trekRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));