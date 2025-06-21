import { CookieStorage, CivicAuth } from '@civic/auth/server';
import dotenv from 'dotenv';
dotenv.config();

const civicConfig = {
  clientId: process.env.CIVIC_CLIENT_ID,
  // Note: We use process.env.PORT which should be set in your .env file
  redirectUrl: `http://localhost:${process.env.PORT}/auth/callback`,
  postLogoutRedirectUrl: process.env.FRONTEND_URL,
};

// Custom cookie storage class that bridges Civic's needs with Express's req/res objects
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

/**
 * Middleware to initialize the CivicAuth instance on every request.
 * This must run before the `protect` middleware.
 */
export const initializeCivicAuth = (req, res, next) => {
  req.storage = new ExpressCookieStorage(req, res);
  req.civicAuth = new CivicAuth(req.storage, civicConfig);
  next();
};

/**
 * The new protection middleware. It checks if a user has an active
 * Civic session cookie.
 */
export const protect = async (req, res, next) => {
  if (!(await req.civicAuth.isLoggedIn())) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  
  next();
};