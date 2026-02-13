import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { AuditLogEntity } from '../models/AuditLog';
import { AuditLog, AuditAction } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuditLogRepository {
  private repo: Repository<AuditLogEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(AuditLogEntity);
  }

  async create(log: Partial<AuditLog>): Promise<AuditLogEntity> {
    const entity = this.repo.create({
      ...log,
      uuid: uuidv4(),
    });

    return this.repo.save(entity);
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByEntityId(entityId: string): Promise<AuditLogEntity[]> {
    return this.repo.find({
      where: { entityId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string, limit: number = 100): Promise<AuditLogEntity[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByAction(action: AuditAction): Promise<AuditLogEntity[]> {
    return this.repo.find({
      where: { action },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: AuditLogEntity[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return { data, total };
  }
}
