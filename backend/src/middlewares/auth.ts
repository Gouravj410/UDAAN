import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../config/logger';
import { JwtPayload, ApplicationError } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
      requestId?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new ApplicationError('UNAUTHORIZED', 401, 'No authentication token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    req.userId = decoded.sub;

    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message });

    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = decoded;
      req.userId = decoded.sub;
    }
  } catch (error) {
    logger.debug('Optional auth failed', { error: (error as Error).message });
  }

  next();
}

export function rolesMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
      return;
    }

    const hasRole = req.user.roles?.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      logger.warn('Authorization failed', {
        userId: req.userId,
        requiredRoles: allowedRoles,
        userRoles: req.user.roles,
      });

      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
