import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage synchronously
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  // Set up axios interceptor to automatically attach token from localStorage
  useEffect(() => {
    // Request interceptor to add token to every request
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Always get the latest token from localStorage
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers['x-auth-token'] = currentToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Set axios default header immediately if token exists
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Ensure axios header is set whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    axios.defaults.headers.common['x-auth-token'] = newToken;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};