import { UserRepository } from '../repositories/UserRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { User, UserRole, UserStatus, ApplicationError, AuditAction } from '../types';
import { logger } from '../config/logger';

export class UserService {
  private userRepository: UserRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async createUser(userData: Partial<User>, userId?: string): Promise<User> {
    if (await this.userRepository.exists(userData.email!)) {
      throw new ApplicationError('USER_EXISTS', 400, 'User with this email already exists');
    }

    const user = await this.userRepository.create({
      ...userData,
      status: UserStatus.ACTIVE,
      role: UserRole.CITIZEN,
    });

    if (userId) {
      await this.auditLogRepository.create({
        entityType: 'User',
        entityId: user.id,
        action: AuditAction.CREATE,
        userId,
        changes: { created: userData },
      });
    }

    logger.info('User created', { userId: user.id, email: user.email });
    return this.mapToUser(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApplicationError('USER_NOT_FOUND', 404, 'User not found');
    }

    return this.mapToUser(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ApplicationError('USER_NOT_FOUND', 404, 'User not found');
    }

    return this.mapToUser(user);
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const { data, total } = await this.userRepository.findAll(page, limit);
    return {
      users: data.map((u) => this.mapToUser(u)),
      total,
    };
  }

  async updateUser(id: string, userData: Partial<User>, userId: string): Promise<User> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new ApplicationError('USER_NOT_FOUND', 404, 'User not found');
    }

    const updated = await this.userRepository.update(id, userData);

    await this.auditLogRepository.create({
      entityType: 'User',
      entityId: id,
      action: AuditAction.UPDATE,
      userId,
      changes: userData,
    });

    logger.info('User updated', { userId: id, updatedBy: userId });
    return this.mapToUser(updated);
  }

  async deleteUser(id: string, userId: string): Promise<void> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new ApplicationError('USER_NOT_FOUND', 404, 'User not found');
    }

    await this.userRepository.softDelete(id);

    await this.auditLogRepository.create({
      entityType: 'User',
      entityId: id,
      action: AuditAction.DELETE,
      userId,
      changes: { deleted: true },
    });

    logger.info('User deleted', { userId: id, deletedBy: userId });
  }

  private mapToUser(entity: any): User {
    return {
      id: entity.id,
      uuid: entity.uuid,
      email: entity.email,
      keycloakId: entity.keycloakId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      address: entity.address,
      city: entity.city,
      state: entity.state,
      pincode: entity.pincode,
      role: entity.role,
      status: entity.status,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
