const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authroute = require('./routes/authroute');
const assetRoutes = require('./routes/assets');
const amcRoutes = require('./routes/amc');
const reportRoutes = require('./routes/reportRoutes');
const { authenticate } = require('./middleware/auth'); // renamed from verifyToken

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authroute);
app.use('/api/assets', authenticate, assetRoutes);
app.use('/api/amc', authenticate, amcRoutes);
app.use('/api/reports', authenticate, reportRoutes);

module.exports = app;
