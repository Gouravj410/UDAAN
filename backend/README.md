# U.D.A.A.N Backend

U.D.A.A.N (Universal Digital Architecture for Accessible Nirmaan) Platform Backend - Scalable Digital Public Infrastructure

## Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: Keycloak (OIDC/OAuth2)
- **ORM**: TypeORM
- **Validation**: Joi
- **Logging**: Winston
- **Metrics**: Prometheus
- **API Docs**: Swagger/OpenAPI

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── models/          # TypeORM entities
│   ├── repositories/    # Data access layer
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation
│   ├── app.ts          # Express app setup
│   └── index.ts        # Server entry point
├── migrations/         # TypeORM migrations
├── tests/              # Test files
├── scripts/            # Utility scripts (seeding, etc.)
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Docker & Docker Compose (optional)

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /api/health/health` - Health status
- `GET /api/health/ready` - Readiness probe

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft)

### Citizen Profiles
- `POST /api/profiles` - Create citizen profile
- `GET /api/profiles` - List profiles (paginated)
- `GET /api/profiles/:id` - Get profile
- `GET /api/profiles/user/:userId` - Get profile by user ID
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### API Documentation
- `GET /api/docs` - Swagger UI

### Metrics
- `GET /metrics` - Prometheus metrics

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

## Authentication

Bearer token required for protected endpoints:
```
Authorization: Bearer <JWT_TOKEN>
```

## Database Migrations

```bash
# Generate new migration
npm run migrate:generate

# Run migrations
npm run migrate
```

## Logging

- Log level: Configured via `LOG_LEVEL` environment variable
- Format: JSON structured logging
- Output: Console and files (`logs/` directory)

## Contributing

1. Follow TypeScript strict mode
2. Use clean architecture patterns
3. Add tests for new features
4. Update API docs in route files

## License

Proprietary
