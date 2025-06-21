// app/page.tsx

"use client"; // This is a Client Component

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Configuration & Types ---

const API_BASE_URL = 'http://localhost:5000'; // Your backend server's URL

// Define types for better code quality and autocompletion
interface User {
  name: string;
  walletAddress: string;
}

interface Idea {
  _id: string;
  title: string;
  // Add other properties of your Idea model here
}


// --- Main Page Component ---

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check user's login status when the component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 'withCredentials: true' is crucial for sending the httpOnly cookie
        const response = await axios.get(`${API_BASE_URL}/api/auth/status`, {
          withCredentials: true,
        });
        
        if (response.data.isLoggedIn) {
          setUser(response.data.user);
        }
      } catch (error) {
        // A 401 error from our backend means the user is not logged in
        console.log('User is not authenticated.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  // --- Event Handlers ---

  const handleLogin = () => {
    // Redirect the entire page to the backend's login route.
    window.location.href = `${API_BASE_URL}/`;
  };

  const handleLogout = () => {
    // Redirect to the backend's logout route.
    window.location.href = `${API_BASE_URL}/auth/logout`;
  };

  // --- Render Logic ---

  if (isLoading) {
    return <div className="container"><h1>Loading session...</h1></div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Research Synthesizer</h1>
        <p>Powered by Civic Auth</p>
      </header>
      
      {user ? (
        // --- LOGGED IN VIEW ---
        <div className="card">
          <h2>Welcome, {user.name || 'User'}!</h2>
          <p><strong>Wallet:</strong> {user.walletAddress}</p>
          <button onClick={handleLogout} className="button-secondary">Logout</button>
          <hr />
          <ProtectedContent />
        </div>
      ) : (
        // --- LOGGED OUT VIEW ---
        <div className="card">
          <h2>Please Log In</h2>
          <p>Authenticate with Civic to access your research dashboard.</p>
          <button onClick={handleLogin} className="button-primary">Login with Civic</button>
        </div>
      )}

      <style jsx>{`
        .container { max-width: 800px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; }
        .header { text-align: center; margin-bottom: 2rem; }
        .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 2rem; }
        hr { border: none; border-top: 1px solid #eee; margin: 1.5rem 0; }
        button { font-size: 1rem; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; margin-top: 1rem; }
        .button-primary { background-color: #0070f3; color: white; }
        .button-secondary { background-color: #eee; color: #333; }
      `}</style>
    </div>
  );
};

// --- Child Component for Fetching Protected Data ---

const ProtectedContent = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [message, setMessage] = useState('');

  const fetchIdeas = async () => {
    setMessage('Loading your ideas...');
    setIdeas([]);
    try {
      const response = await axios.get<Idea[]>(`${API_BASE_URL}/api/idea`, {
        withCredentials: true,
      });
      setIdeas(response.data);
      setMessage(response.data.length === 0 ? 'No ideas found.' : '');
    } catch (error) {
      setMessage('Failed to fetch ideas. Your session may have expired.');
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Your Protected Data</h3>
      <button onClick={fetchIdeas}>Fetch My Ideas</button>
      <p><em>{message}</em></p>
      {ideas.length > 0 && (
        <ul>
          {ideas.map((idea) => (
            <li key={idea._id}>{idea.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;