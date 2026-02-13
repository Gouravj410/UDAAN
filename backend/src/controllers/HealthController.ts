import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export class HealthController {
  async health(req: Request, res: Response): Promise<void> {
    const response: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async readiness(req: Request, res: Response): Promise<void> {
    const response: ApiResponse<{ ready: boolean }> = {
      success: true,
      data: {
        ready: true,
      },
    };

    res.status(200).json(response);
  }
}
