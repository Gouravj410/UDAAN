import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { CitizenProfileEntity } from './CitizenProfile';
import { AuditLogEntity } from './AuditLog';
import { UserRole, UserStatus } from '../types';

@Entity('users')
@Index('idx_users_uuid', ['uuid'], { unique: true })
@Index('idx_users_email', ['email'])
@Index('idx_users_keycloak_id', ['keycloakId'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { unique: true })
  uuid!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar', { nullable: true })
  keycloakId?: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column('varchar', { nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('varchar', { nullable: true })
  city?: string;

  @Column('varchar', { nullable: true })
  state?: string;

  @Column('varchar', { nullable: true })
  pincode?: string;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role!: UserRole;

  @Column('enum', {
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column('jsonb', { nullable: true, default: {} })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => CitizenProfileEntity, (profile) => profile.user)
  citizenProfile?: CitizenProfileEntity;

  @OneToMany(() => AuditLogEntity, (log) => log.user)
  auditLogs?: AuditLogEntity[];
}
