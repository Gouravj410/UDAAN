import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './User';
import { CitizenProfileEntity } from './CitizenProfile';
import { AuditAction } from '../types';

@Entity('audit_logs')
@Index('idx_audit_logs_uuid', ['uuid'], { unique: true })
@Index('idx_audit_logs_entity', ['entityType', 'entityId'])
@Index('idx_audit_logs_user', ['userId'])
@Index('idx_audit_logs_action', ['action'])
@Index('idx_audit_logs_created', ['createdAt'])
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { unique: true })
  uuid!: string;

  @Column('varchar')
  entityType!: string;

  @Column('varchar')
  entityId!: string;


  @Column('uuid')
  userId!: string;

  @Column('varchar')
  action!: AuditAction;
  @Column('simple-json', { nullable: true })
  changes!: Record<string, unknown>;

  @Column('varchar', { nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.auditLogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => CitizenProfileEntity, (profile) => profile.auditLogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  citizenProfile?: CitizenProfileEntity;
}
