import { register, Counter, Histogram, Gauge } from 'prom-client';

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const usersTotal = new Gauge({
  name: 'users_total',
  help: 'Total number of users',
});

export const citizenProfilesTotal = new Gauge({
  name: 'citizen_profiles_total',
  help: 'Total number of citizen profiles',
});

export const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of active database connections',
});

export function metricsEndpoint(_req: any, res: any): void {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
}
