import 'dotenv/config';
import { AppDataSource } from '../src/config/database';

// Ensure NODE_ENV is test
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

beforeAll(async () => {
  try {
    if (!AppDataSource.isInitialized) {
      // initialize the in-memory sqlite datasource
      await AppDataSource.initialize();
    }
  } catch (err) {
    // If already initialized or initialization fails, log for debug
    // eslint-disable-next-line no-console
    console.warn('AppDataSource initialization in jest.setup.ts failed:', (err as Error).message);
  }
});

afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('AppDataSource destroy in jest.setup.ts failed:', (err as Error).message);
  }
});
