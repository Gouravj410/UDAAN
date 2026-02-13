import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './User';
import { DocumentEntity } from './Document';
import { AuditLogEntity } from './AuditLog';

@Entity('citizen_profiles')
@Index('idx_citizen_profiles_uuid', ['uuid'], { unique: true })
@Index('idx_citizen_profiles_user', ['userId'])
export class CitizenProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { unique: true })
  uuid!: string;

  @Column('uuid')
  userId!: string;

  @Column('varchar', { nullable: true, unique: true })
  aadharNumber?: string;

  @Column('date', { nullable: true })
  dateOfBirth?: Date;

  @Column('varchar', { nullable: true })
  gender?: string;

  @Column('varchar', { nullable: true })
  category?: string;

  @Column('numeric', { nullable: true, precision: 15, scale: 2 })
  familyIncome?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => UserEntity, (user) => user.citizenProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @OneToMany(() => DocumentEntity, (doc) => doc.citizenProfile)
  documents?: DocumentEntity[];

  @OneToMany(() => AuditLogEntity, (log) => log.citizenProfile)
  auditLogs?: AuditLogEntity[];
}
