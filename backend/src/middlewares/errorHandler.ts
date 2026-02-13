import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../types';
import { logger } from '../config/logger';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.userId,
    requestId: req.requestId,
  });

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        version: '1.0.0',
      },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        version: '1.0.0',
      },
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
      version: '1.0.0',
    },
  });
}
