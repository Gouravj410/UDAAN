import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserEntity } from '../models/User';
import { User, UserRole, UserStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  private repo: Repository<UserEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserEntity);
  }

  async create(user: Partial<User>): Promise<UserEntity> {
    const entity = this.repo.create({
      ...user,
      uuid: uuidv4(),
    });

    return this.repo.save(entity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['citizenProfile', 'auditLogs'],
    });
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { uuid },
      relations: ['citizenProfile'],
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['citizenProfile'],
    });
  }

  async findByKeycloakId(keycloakId: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { keycloakId },
      relations: ['citizenProfile'],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: UserRole,
    status?: UserStatus
  ): Promise<{ data: UserEntity[]; total: number }> {
    const query = this.repo.createQueryBuilder('user');

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    await this.repo.update(id, user);
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found');
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async deleteHard(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async exists(email: string): Promise<boolean> {
    return (await this.repo.count({ where: { email } })) > 0;
  }
}
