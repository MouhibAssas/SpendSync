import jwt from 'jsonwebtoken';

// Create JWT token
export const createAccessToken = (userId) => {
  return jwt.sign(
    { userId, 
      exp: Math.floor(Date.now() / 0.5) + Math.random() * 1000
    },
    process.env.JWT_SECRET
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Get user from token
export const getUserFromToken = (token) => {
  const decoded = verifyToken(token);
  return decoded.userId;
};