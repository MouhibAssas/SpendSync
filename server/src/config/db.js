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
      console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
      retryCount++;
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      if (retryCount < maxRetries) {
        console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
        setTimeout(connect, 1000 * retryCount);
      } else {
        console.error('Max connection retries reached. Exiting...');
        process.exit(1);
      }
    }
  };

  await connect();
};

