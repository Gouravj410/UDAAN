import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';
import { AppDataSource } from './config/database';
import { logger } from './config/logger';
import { requestIdMiddleware } from './middlewares/requestId';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import citizenProfileRoutes from './routes/citizenProfileRoutes';
import healthRoutes from './routes/healthRoutes';
import { metricsEndpoint } from './utils/metrics';

const app: Express = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'U.D.A.A.N Platform API',
      version: '1.0.0',
      description: 'Digital Public Infrastructure for Citizen Services',
    },
    servers: [
      {
        url: config.api.baseUrl,
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(cors({ origin: config.api.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);
app.use(requestIdMiddleware);
app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', citizenProfileRoutes);

if (config.prometheus.enabled) {
  app.get('/metrics', metricsEndpoint);
}

app.use(errorHandler);

export async function initializeApp(): Promise<Express> {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Failed to initialize database', { error: (error as Error).message });
    throw error;
  }

  return app;
}

export default app;
