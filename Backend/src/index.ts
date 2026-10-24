import dotenv from 'dotenv';
import path from 'path';

// Load .env before anything else
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import connectDB from './db/index';
import logger from './utils/logger';
import { DB_NAME } from './constants';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info(`📦 Connected to database: ${DB_NAME}`);

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}/api/v1`);
      // logger.info(`❤️  Health: http://localhost:${PORT}/api/v1/health`);
    });

    // ─────────────────────────────────────────────
    // Graceful Shutdown Handlers
    // ─────────────────────────────────────────────
    const shutdown = (signal: string) => {
      logger.warn(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason: Error) => {
      logger.error(`Unhandled Rejection: ${reason.message}`);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
