import { Request, Response } from 'express';
import { CitizenProfileService } from '../services/CitizenProfileService';
import { logger } from '../config/logger';
import { ApiResponse } from '../types';

export class CitizenProfileController {
  private profileService: CitizenProfileService;

  constructor() {
    this.profileService = new CitizenProfileService();
  }

  async createProfile(req: Request, res: Response): Promise<void> {
    const profile = await this.profileService.createProfile(req.body, req.userId!);

    logger.info('Citizen profile creation endpoint called', { profileId: profile.id });

    const response: ApiResponse<typeof profile> = {
      success: true,
      data: profile,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(201).json(response);
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const profile = await this.profileService.getProfileById(id);

    const response: ApiResponse<typeof profile> = {
      success: true,
      data: profile,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async getProfileByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const profile = await this.profileService.getProfileByUserId(userId);

    const response: ApiResponse<typeof profile> = {
      success: true,
      data: profile,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async getProfiles(req: Request, res: Response): Promise<void> {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const { profiles, total } = await this.profileService.getProfiles(page, limit);

    const response = {
      success: true,
      data: profiles,
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

  async updateProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const profile = await this.profileService.updateProfile(id, req.body, req.userId!);

    const response: ApiResponse<typeof profile> = {
      success: true,
      data: profile,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId!,
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  }

  async deleteProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.profileService.deleteProfile(id, req.userId!);

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
