import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../config/logger';
import { ApiResponse } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const user = await this.userService.createUser(req.body, req.userId);

    logger.info('User creation endpoint called', { userId: user.id });

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(201).json(response);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const { users, total } = await this.userService.getUsers(page, limit);

    const response = {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.updateUser(id, req.body, req.userId!);

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.userService.deleteUser(id, req.userId!);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }
}
