import mongoose from 'mongoose';

// Get MongoDB Atlas connection string from environment
const getDbUri = () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendsync';
  return MONGO_URI;
};

// Enhanced connection with retry logic
export const connectWithRetry = async () => {
  const maxRetries = 3;
  let retryCount = 0;
  
  const connect = async () => {
    try {
      await mongoose.connect(getDbUri());
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Connection attempt ${retryCount} of ${maxRetries}`);
        setTimeout(() => connect(), 1000 * retryCount);
      }
    }
  }
  
  await connect();
};

export { connectWithRetry(); }