import React, { createContext, useState, useContext, useEffect } from 'react';

// The API endpoint for our backend
const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // State will now hold the token, user object, and loading status
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // This effect runs when the component mounts to load the user
  // if a token is already present in localStorage.
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Send token to the backend to get user data
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { 'x-auth-token': storedToken },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
            setToken(storedToken);
          } else {
            // Token is invalid, remove it
            logout();
          }
        } catch (error) {
          console.error("Failed to load user", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register function
  const register = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      await loadUserFromToken(data.token); // Reload user after registration
    } else {
      throw new Error(data.msg || 'Registration failed');
    }
  };
  
  // Login function
  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        await loadUserFromToken(data.token);
      } else {
        throw new Error(data.msg || 'Login failed');
      }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setLoading(false);
  };
  
  // Helper to load user data after login/register
  const loadUserFromToken = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { 'x-auth-token': token },
      });
      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      setToken(token);
      setLoading(false);
  }

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}