import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

describe('API Integration Tests', () => {
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    try {
      const response = await axios.post(`${API_BASE}/users`, {
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
      });
      userId = response.data.data.id;
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });

  afterAll(async () => {
    if (userId) {
      try {
        await axios.delete(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }
  });

  it('creates a user', async () => {
    const response = await axios.post(`${API_BASE}/users`, {
      email: `newuser-${Date.now()}@example.com`,
      firstName: 'New',
      lastName: 'User',
    });

    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
    expect(response.data.data).toHaveProperty('id');
    expect(response.data.data.email).toBeDefined();
  });

  it('retrieves users', async () => {
    const response = await axios.get(`${API_BASE}/users`);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  it('checks health endpoint', async () => {
    const response = await axios.get(`${API_BASE}/health/health`);

    expect(response.status).toBe(200);
    expect(response.data.data.status).toBe('healthy');
  });
});
