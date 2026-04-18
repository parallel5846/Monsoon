import mongoose from 'mongoose';

/**
 * MongoDB Database Connection Configuration
 * Handles connection setup and event listeners
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy-project';

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
    console.log(`✓ Database: ${mongoose.connection.name}`);
    console.log(`✓ Host: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('✗ MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('✗ MongoDB connection error:', error.message);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected successfully');
  } catch (error) {
    console.error('✗ Error disconnecting from MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Get current MongoDB connection status
 * @returns {boolean} True if connected, false otherwise
 */
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default {
  connectDB,
  disconnectDB,
  isConnected,
};
