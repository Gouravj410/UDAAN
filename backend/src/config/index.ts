import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'udaan_db',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },

  keycloak: {
    url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'master',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'backend',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || 'secret',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  prometheus: {
    enabled: process.env.PROMETHEUS_ENABLED === 'true',
    port: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
  },

  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    corsOrigin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '*' : 'http://localhost:5173'),
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'huggingface',
    model: process.env.AI_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  },

  audit: {
    enabled: process.env.AUDIT_LOG_ENABLED === 'true',
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
};
