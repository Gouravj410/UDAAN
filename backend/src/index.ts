import 'dotenv/config';
import { config } from './config';
import { initializeApp } from './app';
import { logger } from './config/logger';

async function startServer(): Promise<void> {
  try {
    const app = await initializeApp();

    const server = app.listen(config.port, config.host, () => {
      logger.info(`Server running on ${config.host}:${config.port} in ${config.env} mode`);
      logger.info(`API docs available at ${config.api.baseUrl}/api/docs`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: (error as Error).message });
    process.exit(1);
  }
}

startServer();
