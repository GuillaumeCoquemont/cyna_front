import React, { createContext, useState } from 'react';
import { login as apiLogin } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const signIn = async (credentials) => {
    const data = await apiLogin(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data); // Utilise directement la réponse du login
    return data;
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