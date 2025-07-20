import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authroute from './routes/authroute.js';
import assetRoutes from './routes/assets.js';
import amcRoutes from './routes/amc.js';
import reportRoutes from './routes/reportRoutes.js';
import taskRoutes from './routes/tasks.js'; // ✅ Import task routes
import { authenticate } from './middleware/auth.js'; // Ensure this is a named export

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authroute);
app.use('/api/assets', authenticate, assetRoutes);
app.use('/api/amc', authenticate, amcRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/tasks', authenticate, taskRoutes); // ✅ New line to add task routes

export default app;
