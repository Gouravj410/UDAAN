import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { DocumentEntity } from '../models/Document';
import { Document, VerificationStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class DocumentRepository {
  private repo: Repository<DocumentEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(DocumentEntity);
  }

  async create(document: Partial<Document>): Promise<DocumentEntity> {
    const entity = this.repo.create({
      ...document,
      uuid: uuidv4(),
    });

    return this.repo.save(entity);
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['citizenProfile'],
    });
  }

  async findByUuid(uuid: string): Promise<DocumentEntity | null> {
    return this.repo.findOne({
      where: { uuid },
    });
  }

  async findByCitizenProfileId(citizenProfileId: string): Promise<DocumentEntity[]> {
    return this.repo.find({
      where: { citizenProfileId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: VerificationStatus): Promise<DocumentEntity[]> {
    return this.repo.find({
      where: { verificationStatus: status },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, document: Partial<DocumentEntity>): Promise<DocumentEntity> {
    await this.repo.update(id, document as any);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Document not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
