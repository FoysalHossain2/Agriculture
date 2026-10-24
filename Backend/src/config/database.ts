import mongoose from 'mongoose';
import config from './config';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database.mongoUri, {
      autoIndex: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB error: ${err.message}`);
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
};

export default connectDB;
