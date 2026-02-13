import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userService = new UserService();
    userRepository = new UserRepository();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '9999999999',
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'duplicate@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by id', async () => {
      const userData = {
        email: 'retrieve@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const created = await userService.createUser(userData);
      const retrieved = await userService.getUserById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.email).toBe(userData.email);
    });

    it('should throw error if user not found', async () => {
      await expect(userService.getUserById('non-existent-id')).rejects.toThrow('User not found');
    });
  });

  describe('getUsers', () => {
    it('should retrieve paginated users', async () => {
      const result = await userService.getUsers(1, 10);

      expect(result).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
      expect(typeof result.total).toBe('number');
    });
  });
});
