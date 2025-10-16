// Create a file: context/MockAuthContext.js
import React, { createContext, useContext, useState } from 'react';

const MockAuthContext = createContext();

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'mock-user-id',
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    country: 'United States',
    currency: 'USD',
    profilePhoto: null
  });

  const login = async (email, password) => {
    // Mock login - always succeeds
    return Promise.resolve();
  };

  const googleLogin = async () => {
    // Mock Google login - always succeeds
    return Promise.resolve();
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
  };

  return (
    <MockAuthContext.Provider value={{ user, login, googleLogin, logout }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  return useContext(MockAuthContext);
}