import { AppDataSource } from '../config/database';
import { UserEntity } from '../models/User';
import { CitizenProfileEntity } from '../models/CitizenProfile';
import { UserRole, UserStatus } from '../types';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

async function seed(): Promise<void> {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected');

    const userRepo = AppDataSource.getRepository(UserEntity);
    const existingUser = await userRepo.findOne({
      where: { email: 'admin@udaan.gov.in' },
    });

    if (!existingUser) {
      const adminUser = userRepo.create({
        uuid: uuidv4(),
        email: 'admin@udaan.gov.in',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      });

      await userRepo.save(adminUser);
      logger.info('Admin user created', { email: adminUser.email });

      const citizenUser = userRepo.create({
        uuid: uuidv4(),
        email: 'citizen@udaan.gov.in',
        firstName: 'Test',
        lastName: 'Citizen',
        phone: '9999999999',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        role: UserRole.CITIZEN,
        status: UserStatus.ACTIVE,
      });

      await userRepo.save(citizenUser);
      logger.info('Citizen user created', { email: citizenUser.email });

      const profileRepo = AppDataSource.getRepository(CitizenProfileEntity);
      const profile = profileRepo.create({
        uuid: uuidv4(),
        userId: citizenUser.id,
        aadharNumber: '123456789012',
        gender: 'M',
        category: 'General',
        familyIncome: 500000,
      });

      await profileRepo.save(profile);
      logger.info('Citizen profile created', { userId: citizenUser.id });
    } else {
      logger.info('Database already seeded');
    }

    await AppDataSource.destroy();
    logger.info('Seed completed successfully');
  } catch (error) {
    logger.error('Seed failed', { error: (error as Error).message });
    process.exit(1);
  }
}

seed();
