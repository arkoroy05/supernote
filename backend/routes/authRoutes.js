import express from 'express';

const router = express.Router();

// Redirects the user to the Civic login page
router.get('/login', async (req, res) => {
  const url = await req.civicAuth.buildLoginUrl();
  res.redirect(url.toString());
});

// Handles the final step of logging out
router.get('/logout', async (req, res) => {
  try {
    // Delete our local session cookie
    await req.storage.delete('access_token');
    await req.storage.delete('id_token');
    await req.storage.delete('oidc_session_expires_at');
    await req.storage.delete('refresh_token');

    // Build the URL to log out of Civic's central service
    const url = await req.civicAuth.buildLogoutRedirectUrl();
    // Redirect the user's browser
    res.redirect(url.toString());
  } catch (error) {
    console.error('Error during logout:', error);
    res.redirect(process.env.FRONTEND_URL); // Redirect home on failure
  }
});

// The URL that Civic redirects back to after a successful login
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  // Exchanges the authorization code for a session
  await req.civicAuth.resolveOAuthAccessCode(code, state);
  // Redirect the user back to the frontend application
  res.redirect(process.env.FRONTEND_URL);
});

// An API route to check the user's current login status from the frontend
router.get('/status', async (req, res) => {
    if (!(await req.civicAuth.isLoggedIn())) {
        return res.status(200).json({ isLoggedIn: false });
    }
    try {
        const user = await req.civicAuth.getUser();
        res.status(200).json({
            isLoggedIn: true,
            user: { name: user?.name, walletAddress: user?.walletAddress }
        });
    } catch (error) {
        res.status(500).json({ isLoggedIn: false, message: 'Server error' });
    }
});

export default router;