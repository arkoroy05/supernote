// server.js
// Complete and corrected file with logout fix

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';

// Civic Auth imports
import { CookieStorage, CivicAuth } from '@civic/auth/server';

// Assuming these files exist in their respective directories
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

// --- Configuration ---
dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const civicConfig = {
  clientId: process.env.CIVIC_CLIENT_ID,
  redirectUrl: `http://localhost:${PORT}/auth/callback`,
  postLogoutRedirectUrl: FRONTEND_URL, 
};

// --- Database & Express App Initialization ---
connectDB();
const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});

// --- Civic Auth Middleware & Storage ---
class ExpressCookieStorage extends CookieStorage {
  constructor(req, res) {
    super({ secure: process.env.NODE_ENV === 'production' });
    this.req = req;
    this.res = res;
  }
  async get(key) { return Promise.resolve(this.req.cookies[key] || null); }
  async set(key, value) { this.res.cookie(key, value, this.settings); return Promise.resolve(); }
  async delete(key) { this.res.clearCookie(key); return Promise.resolve(); }
}

app.use((req, res, next) => {
  req.storage = new ExpressCookieStorage(req, res);
  req.civicAuth = new CivicAuth(req.storage, civicConfig);
  next();
});

// --- Public Authentication Routes ---
app.get('/', async (req, res) => {
  const url = await req.civicAuth.buildLoginUrl();
  res.redirect(url.toString());
});

// CORRECTED LOGOUT ROUTE
app.get('/auth/logout', async (req, res) => {
  try {
    // 1. Manually delete the application's session cookie.
    console.log("Clearing 'civic-session' cookie...");
    await req.storage.delete('civic-session');

    // 2. Build the URL to log the user out of Civic's central service.
    const url = await req.civicAuth.buildLogoutRedirectUrl();

    // 3. Redirect the user's browser.
    res.redirect(url.toString());
  } catch (error) {
    console.error('Error during logout:', error);
    res.redirect(FRONTEND_URL); // Fail safe by redirecting to frontend
  }
});

app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  await req.civicAuth.resolveOAuthAccessCode(code, state);
  res.redirect(FRONTEND_URL);
});

// --- Protected API Routes ---
const authMiddleware = async (req, res, next) => {
  if (!(await req.civicAuth.isLoggedIn())) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  next();
};

app.get('/api/auth/status', authMiddleware, async (req, res) => {
  try {
    const user = await req.civicAuth.getUser();
    res.status(200).json({
      isLoggedIn: true,
      user: { name: user?.name, walletAddress: user?.walletAddress }
    });
  } catch (error) {
    res.status(500).json({ isLoggedIn: false, message: 'Server error retrieving user data' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/idea', authMiddleware, ideaRoutes);
app.use('/api/project', authMiddleware, projectRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);

// --- Server Startup ---
console.log('\n✅ Registered routes:\n', listEndpoints(app), '\n');
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`👂 Accepting requests from frontend at ${FRONTEND_URL}`);
});