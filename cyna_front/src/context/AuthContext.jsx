import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, fetchMe } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchMe(token)
        .then(data => setUser(data))
        .catch(() => signOut());
    }
  }, [token]);

  const signIn = async (credentials) => {
    const { token: newToken } = await apiLogin(credentials);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const me = await fetchMe(newToken);
    setUser(me);
    return me;
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}