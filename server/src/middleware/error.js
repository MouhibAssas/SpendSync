import { validationResult } from 'express-validator';

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handle validation errors
export const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.status = 4;
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.status = 4;
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.status = 4;
  }
  
  // Default error
  if (!error.status) {
    error.status = 500;
    error.message = 'Server Error';
  }
  
  res.status(error.status).json({
    success: false,
    error: error.message
  });
};