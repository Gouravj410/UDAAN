import { DataSource } from 'typeorm';
import { config } from './index';
import { UserEntity } from '../models/User';
import { CitizenProfileEntity } from '../models/CitizenProfile';
import { DocumentEntity } from '../models/Document';
import { AuditLogEntity } from '../models/AuditLog';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const useSqlite = isTest || isDev;

export const AppDataSource = new DataSource(
  useSqlite
    ? {
        type: 'sqlite',
        database: isDev ? 'dev.sqlite' : ':memory:',
        synchronize: true,
        logging: isDev,
        entities: [UserEntity, CitizenProfileEntity, DocumentEntity, AuditLogEntity],
      }
    : {
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        entities: [UserEntity, CitizenProfileEntity, DocumentEntity, AuditLogEntity],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: [],
        dropSchema: false,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
);
