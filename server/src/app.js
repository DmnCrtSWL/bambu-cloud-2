const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/private');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/public', publicRoutes);
app.use('/api/admin', protectedRoutes);

// Health check
app.use('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports = app;
