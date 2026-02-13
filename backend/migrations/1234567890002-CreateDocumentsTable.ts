import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateDocumentsTable1234567890002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'citizenProfileId',
            type: 'uuid',
          },
          {
            name: 'documentType',
            type: 'varchar',
          },
          {
            name: 'documentUrl',
            type: 'text',
          },
          {
            name: 'verificationStatus',
            type: 'enum',
            enum: ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'],
            default: `'PENDING'`,
          },
          {
            name: 'verifiedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'documents',
      new TableIndex({
        name: 'idx_documents_uuid',
        columnNames: ['uuid'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'documents',
      new TableIndex({
        name: 'idx_documents_citizen',
        columnNames: ['citizenProfileId'],
      })
    );

    await queryRunner.createForeignKey(
      'documents',
      new TableForeignKey({
        columnNames: ['citizenProfileId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'citizen_profiles',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('documents');
  }
}
