// src/auth/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../apollo';
import { GET_ME } from '../graphql/queries';

export const AuthContext = createContext({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(null);
  const navigate = useNavigate();

  // Whenever the token changes, persist it and load current user
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      client
        .query({ query: GET_ME })
        .then(({ data }) => setUser(data.me))
        .catch(() => {
          // if token invalid or expired, clear everything
          setToken(null);
          setUser(null);
        });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (newToken) => {
    setToken(newToken);
    await client.resetStore(); // clear any cached queries
    navigate('/');
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await client.clearStore(); // tear down active queries
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
