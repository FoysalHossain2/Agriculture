import app from './app';
import connectDB from './config/database';
import config from './config/config';
import logger from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the HTTP server
    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`);
      logger.info(`📡 API: http://localhost:${config.server.port}/api/v1`);
      logger.info(`❤️  Health: http://localhost:${config.server.port}/api/v1/health`);
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

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error) => {
      logger.error(`Unhandled Rejection: ${reason.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
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
