import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // NEW: Required for Civic Auth
import listEndpoints from 'express-list-endpoints';

// --- Local Imports ---
import connectDB from './config/db.js';
import { initializeCivicAuth, protect } from './middleware/authMiddleware.js'; // UPDATED: Import new middleware
import authRoutes from './routes/authRoutes.js'; // This is now for the Civic redirect routes
import ideaRoutes from './routes/ideaRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
// Note: your code mentioned stealthRoutes, so I've included it.
import stealthRoutes from './routes/stealthRoutes.js';


// --- Configuration ---
dotenv.config();
const PORT = process.env.PORT || 5001; // Ensure a default port
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';


// --- Database & Express App Initialization ---
connectDB();
const app = express();


// --- Core Middleware ---
app.use(cors({
  origin: FRONTEND_URL, // Use the variable for consistency
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // NEW: Must be used BEFORE Civic middleware
app.use(initializeCivicAuth); // NEW: Initializes Civic on every request


// --- Public Authentication Routes ---
// These handle the browser redirects for login/logout/callback
app.use('/auth', authRoutes);


// --- Health Check & Protected API Routes ---
app.get('/api', (req, res) => {
    res.send('AI Research Synthesizer API is running...');
});

// UPDATED: Apply the `protect` middleware to all API route groups
app.use('/api/idea', protect, ideaRoutes);
app.use('/api/project', protect, projectRoutes);
app.use('/api/stealth', protect, stealthRoutes);
app.use('/api/documents', protect, documentRoutes);


// --- Server Startup ---
console.log('\n✅ Registered routes:\n', listEndpoints(app), '\n');
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`👂 Accepting requests from frontend at ${FRONTEND_URL}`);
});