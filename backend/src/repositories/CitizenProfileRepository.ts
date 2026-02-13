import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { CitizenProfileEntity } from '../models/CitizenProfile';
import { CitizenProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CitizenProfileRepository {
  private repo: Repository<CitizenProfileEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(CitizenProfileEntity);
  }

  async create(profile: Partial<CitizenProfile>): Promise<CitizenProfileEntity> {
    const entity = this.repo.create({
      ...profile,
      uuid: uuidv4(),
    });

    return this.repo.save(entity);
  }

  async findById(id: string): Promise<CitizenProfileEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'documents', 'auditLogs'],
    });
  }

  async findByUuid(uuid: string): Promise<CitizenProfileEntity | null> {
    return this.repo.findOne({
      where: { uuid },
      relations: ['user', 'documents'],
    });
  }

  async findByUserId(userId: string): Promise<CitizenProfileEntity | null> {
    return this.repo.findOne({
      where: { userId },
      relations: ['user', 'documents'],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<{ data: CitizenProfileEntity[]; total: number }> {
    const query = this.repo.createQueryBuilder('profile');

    if (category) {
      query.andWhere('profile.category = :category', { category });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('profile.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async update(id: string, profile: Partial<CitizenProfileEntity>): Promise<CitizenProfileEntity> {
    await this.repo.update(id, profile as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Citizen profile not found');
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async deleteHard(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
