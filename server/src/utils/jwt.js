import jwt from 'jsonwebtoken';

// Create JWT token
export const createAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
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