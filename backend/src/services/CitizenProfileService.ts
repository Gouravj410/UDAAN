import { CitizenProfileRepository } from '../repositories/CitizenProfileRepository';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { CitizenProfile, ApplicationError, AuditAction } from '../types';
import { logger } from '../config/logger';

export class CitizenProfileService {
  private profileRepository: CitizenProfileRepository;
  private documentRepository: DocumentRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.profileRepository = new CitizenProfileRepository();
    this.documentRepository = new DocumentRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async createProfile(profileData: Partial<CitizenProfile>, userId: string): Promise<CitizenProfile> {
    const existing = await this.profileRepository.findByUserId(profileData.userId!);

    if (existing) {
      throw new ApplicationError(
        'PROFILE_EXISTS',
        400,
        'Citizen profile already exists for this user'
      );
    }

    const profile = await this.profileRepository.create(profileData);

    await this.auditLogRepository.create({
      entityType: 'CitizenProfile',
      entityId: profile.id,
      action: AuditAction.CREATE,
      userId,
      changes: { created: profileData },
    });

    logger.info('Citizen profile created', { profileId: profile.id, userId });
    return this.mapToProfile(profile);
  }

  async getProfileById(id: string): Promise<CitizenProfile> {
    const profile = await this.profileRepository.findById(id);

    if (!profile) {
      throw new ApplicationError('PROFILE_NOT_FOUND', 404, 'Citizen profile not found');
    }

    return this.mapToProfile(profile);
  }

  async getProfileByUserId(userId: string): Promise<CitizenProfile> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new ApplicationError('PROFILE_NOT_FOUND', 404, 'Citizen profile not found');
    }

    return this.mapToProfile(profile);
  }

  async getProfiles(page: number = 1, limit: number = 10): Promise<{ profiles: CitizenProfile[]; total: number }> {
    const { data, total } = await this.profileRepository.findAll(page, limit);
    return {
      profiles: data.map((p) => this.mapToProfile(p)),
      total,
    };
  }

  async updateProfile(
    id: string,
    profileData: Partial<CitizenProfile>,
    userId: string
  ): Promise<CitizenProfile> {
    const existing = await this.profileRepository.findById(id);

    if (!existing) {
      throw new ApplicationError('PROFILE_NOT_FOUND', 404, 'Citizen profile not found');
    }

    const updated = await this.profileRepository.update(id, profileData);

    await this.auditLogRepository.create({
      entityType: 'CitizenProfile',
      entityId: id,
      action: AuditAction.UPDATE,
      userId,
      changes: profileData,
    });

    logger.info('Citizen profile updated', { profileId: id, updatedBy: userId });
    return this.mapToProfile(updated);
  }

  async deleteProfile(id: string, userId: string): Promise<void> {
    const existing = await this.profileRepository.findById(id);

    if (!existing) {
      throw new ApplicationError('PROFILE_NOT_FOUND', 404, 'Citizen profile not found');
    }

    await this.profileRepository.softDelete(id);

    await this.auditLogRepository.create({
      entityType: 'CitizenProfile',
      entityId: id,
      action: AuditAction.DELETE,
      userId,
      changes: { deleted: true },
    });

    logger.info('Citizen profile deleted', { profileId: id, deletedBy: userId });
  }

  private mapToProfile(entity: any): CitizenProfile {
    return {
      id: entity.id,
      uuid: entity.uuid,
      userId: entity.userId,
      aadharNumber: entity.aadharNumber,
      dateOfBirth: entity.dateOfBirth,
      gender: entity.gender,
      category: entity.category,
      familyIncome: entity.familyIncome,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
