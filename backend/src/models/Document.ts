import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CitizenProfileEntity } from './CitizenProfile';
import { VerificationStatus } from '../types';

@Entity('documents')
@Index('idx_documents_uuid', ['uuid'], { unique: true })
@Index('idx_documents_citizen', ['citizenProfileId'])
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { unique: true })
  uuid!: string;

  @Column('uuid')
  citizenProfileId!: string;

  @Column('varchar')
  documentType!: string;

  @Column('text')
  documentUrl!: string;

  @Column('varchar', { default: VerificationStatus.PENDING })
  verificationStatus!: VerificationStatus;

  @Column('datetime', { nullable: true })
  verifiedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CitizenProfileEntity, (profile) => profile.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'citizenProfileId' })
  citizenProfile?: CitizenProfileEntity;
}
