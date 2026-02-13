import request from 'supertest';
import app from '../src/app';

describe('Health Endpoints', () => {
  describe('GET /api/health/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app).get('/api/health/ready');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ready).toBe(true);
    });
  });
});
