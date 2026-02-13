import { CitizenProfileService } from '../src/services/CitizenProfileService';
import { UserService } from '../src/services/UserService';

describe('CitizenProfileService', () => {
  let profileService: CitizenProfileService;
  let userService: UserService;

  beforeEach(() => {
    profileService = new CitizenProfileService();
    userService = new UserService();
  });

  describe('createProfile', () => {
    it('should create a citizen profile', async () => {
      const userData = {
        email: 'citizen@example.com',
        firstName: 'Jane',
        lastName: 'Citizen',
      };

      const user = await userService.createUser(userData);

      const profileData = {
        userId: user.id,
        aadharNumber: '123456789012',
        gender: 'F',
        category: 'General',
        familyIncome: 500000,
      };

      const profile = await profileService.createProfile(profileData, user.id);

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(user.id);
      expect(profile.aadharNumber).toBe(profileData.aadharNumber);
    });

    it('should throw error if profile already exists', async () => {
      const userData = {
        email: 'duplicate-profile@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await userService.createUser(userData);

      const profileData = {
        userId: user.id,
        aadharNumber: '999999999999',
      };

      await profileService.createProfile(profileData, user.id);

      await expect(profileService.createProfile(profileData, user.id)).rejects.toThrow(
        'Citizen profile already exists for this user'
      );
    });
  });

  describe('getProfileByUserId', () => {
    it('should retrieve profile by user id', async () => {
      const userData = {
        email: 'profile-retrieve@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await userService.createUser(userData);

      const profileData = {
        userId: user.id,
        category: 'OBC',
      };

      await profileService.createProfile(profileData, user.id);
      const retrieved = await profileService.getProfileByUserId(user.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.userId).toBe(user.id);
    });

    it('should throw error if profile not found', async () => {
      await expect(profileService.getProfileByUserId('non-existent-user-id')).rejects.toThrow(
        'Citizen profile not found'
      );
    });
  });
});
