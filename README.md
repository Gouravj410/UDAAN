# U.D.A.A.N Platform - Complete Project

## Overview

U.D.A.A.N (Universal Digital Architecture for Accessible Nirmaan) is a production-ready, scalable digital public infrastructure platform following the Foundation → Operations → Intelligence → Governance → Ecosystem maturity progression.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **API**: REST + OpenAPI/Swagger
- **Authentication**: Keycloak (OIDC/OAuth2)
- **ORM**: TypeORM
- **Validation**: Joi
- **Logging**: Winston
- **Metrics**: Prometheus
- **Testing**: Jest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Server**: Nginx
- **Health Checks**: Built-in health endpoints

## Project Structure

```
UDAAN/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # TypeORM entities
│   │   ├── repositories/      # Data access layer
│   │   ├── services/          # Business logic
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   ├── validators/        # Input validation
│   │   ├── utils/             # Utilities
│   │   ├── types/             # TypeScript types
│   │   ├── app.ts            # Express app
│   │   └── index.ts          # Server entry
│   ├── migrations/            # Database migrations
│   ├── tests/                 # Test files
│   ├── scripts/               # Utility scripts
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── README.md
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx           # Main component
│   │   └── main.tsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── docker/                     # Docker configuration
│   ├── Dockerfile.backend     # Backend image
│   ├── Dockerfile.frontend    # Frontend image
│   └── nginx.conf             # Nginx config
│
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD
│
├── docker-compose.yml         # Full stack orchestration
├── .gitignore
└── README.md                  # This file
```

## Quick Start

### Prerequisites

- Docker & Docker Compose (recommended)
- Node.js 18+ (for development)
- PostgreSQL 12+ (if running without Docker)
- Redis 6+ (if running without Docker)

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone repository
git clone <repository_url>
cd UDAAN

# Start all services
docker-compose up -d

# Wait for services to initialize (approximately 1-2 minutes)
sleep 60

# Seed the database (optional, but recommended)
docker-compose exec backend npm run seed
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health/health
- **Keycloak**: http://localhost:8080
- **Prometheus**: http://localhost:9090

### Option 2: Manual Setup (Development)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb udaan_db

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

## Available Endpoints

### Health & Status
- `GET /api/health/health` - Service health status
- `GET /api/health/ready` - Readiness probe

### User Management
- `POST /api/users` - Create new user
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth, soft delete)

### Citizen Profiles
- `POST /api/profiles` - Create citizen profile (requires auth)
- `GET /api/profiles` - List profiles (requires auth, paginated)
- `GET /api/profiles/:id` - Get profile details (requires auth)
- `GET /api/profiles/user/:userId` - Get profile by user ID (requires auth)
- `PUT /api/profiles/:id` - Update profile (requires auth)
- `DELETE /api/profiles/:id` - Delete profile (requires auth, soft delete)

### Documentation & Monitoring
- `GET /api/docs` - Swagger UI documentation
- `GET /metrics` - Prometheus metrics

## Authentication

The platform uses JWT-based authentication via Keycloak.

### Login Flow

1. User credentials submitted to backend
2. Backend validates and issues JWT token
3. Token stored in localStorage (frontend)
4. Subsequent requests include token in `Authorization: Bearer <TOKEN>` header
5. Token automatically added to all API requests via axios interceptor
6. 401 responses trigger automatic logout and redirect to login

### Test Credentials

After seeding (optional):
- **Admin**: admin@udaan.gov.in
- **Citizen**: citizen@udaan.gov.in

## Database Schema

### Users Table
- id (UUID, primary key)
- uuid (UUID, unique)
- email (varchar, unique)
- firstName (varchar)
- lastName (varchar)
- phone (varchar, optional)
- address (text, optional)
- city (varchar, optional)
- state (varchar, optional)
- pincode (varchar, optional)
- role (enum: CITIZEN, OFFICER, ADMIN)
- status (enum: ACTIVE, INACTIVE, SUSPENDED, DELETED)
- metadata (jsonb, optional)
- createdAt (timestamp)
- updatedAt (timestamp)
- deletedAt (timestamp, soft delete)

### Citizen Profiles Table
- id (UUID, primary key)
- uuid (UUID, unique)
- userId (UUID, foreign key)
- aadharNumber (varchar, unique, optional)
- dateOfBirth (date, optional)
- gender (varchar, optional)
- category (varchar, optional)
- familyIncome (numeric, optional)
- createdAt (timestamp)
- updatedAt (timestamp)
- deletedAt (timestamp, soft delete)

### Documents Table
- id (UUID, primary key)
- uuid (UUID, unique)
- citizenProfileId (UUID, foreign key)
- documentType (varchar)
- documentUrl (text)
- verificationStatus (enum: PENDING, VERIFIED, REJECTED, EXPIRED)
- verifiedAt (timestamp, optional)
- createdAt (timestamp)
- updatedAt (timestamp)

### Audit Logs Table
- id (UUID, primary key)
- uuid (UUID, unique)
- entityType (varchar)
- entityId (varchar)
- action (enum: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, VERIFY, REJECT)
- userId (varchar)
- changes (jsonb)
- ipAddress (varchar, optional)
- createdAt (timestamp)

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test:watch

# UI mode
npm test:ui
```

## Logging

Logs are structured JSON format and output to:
- **Console**: Real-time log display
- **Files**: 
  - `logs/all.log` - All logs
  - `logs/error.log` - Errors only

Log levels: `error`, `warn`, `info`, `http`, `debug`

Control via `LOG_LEVEL` environment variable.

## Monitoring

### Prometheus Metrics

Available at `GET /metrics` endpoint when `PROMETHEUS_ENABLED=true`

Key metrics:
- `http_requests_total` - Total HTTP requests by method, route, status
- `http_request_duration_seconds` - Request latency histogram
- `users_total` - Total user count
- `citizen_profiles_total` - Total citizen profile count
- `database_connections` - Active database connections

### Health Checks

Configured for Docker Compose with:
- **Backend**: HTTP health check on `/api/health/health`
- **Frontend**: HTTP health check on root path
- **PostgreSQL**: TCP health check on port 5432
- **Redis**: PING health check

## API Documentation

Interactive Swagger documentation available at `http://localhost:3000/api/docs`

Features:
- Try-it-out functionality
- Request/response schemas
- Authentication examples
- Error codes and descriptions

## Environment Variables

See `.env.example` files in backend and frontend directories.

### Key Backend Variables

```bash
NODE_ENV=development|production
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=udaan_user
DATABASE_PASSWORD=password
DATABASE_NAME=udaan_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=udaan
KEYCLOAK_CLIENT_ID=udaan-backend
KEYCLOAK_CLIENT_SECRET=secret

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Prometheus
PROMETHEUS_ENABLED=true
```

## Deployment

### Docker Compose (Development/Staging)

Simply run:
```bash
docker-compose up -d
```

### Kubernetes (Production)

Create deployment manifests for each service with:
- Resource limits
- Readiness/liveness probes
- Service definitions
- Ingress configuration
- Persistent volume claims

### CI/CD Pipeline

GitHub Actions automatically:
1. Lint and test code on push/PR
2. Build Docker images on main branch push
3. Push to registry
4. Can trigger deployment via webhook

## Architecture Layers

### Foundation
- Keycloak authentication
- JWT validation
- User identity management
- Role-based access control

### Operations
- CRUD APIs for users and citizen profiles
- Database persistence with TypeORM
- Validation and error handling
- Request logging and tracking

### Intelligence
- AI abstraction layer (pluggable providers)
- HuggingFace integration ready
- Document processing hooks
- Recommendation engine ready

### Governance
- Comprehensive audit logging
- Policy enforcement hooks
- Soft deletes for data retention
- Role-based authorization

### Ecosystem Maturity
- RESTful API design
- OpenAPI documentation
- Scalable architecture
- Observability (logs, metrics)
- Production-grade error handling

## Contributing

1. Follow TypeScript strict mode
2. Use clean architecture patterns
3. Add tests for new features
4. Update API documentation
5. Follow commit message conventions

## License

Proprietary - U.D.A.A.N Project

## Support

For issues or questions, open an issue in the repository.
