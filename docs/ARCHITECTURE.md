# UDAAN Platform Architecture & Design

## System Overview

U.D.A.A.N is a **digital public infrastructure platform** built on clean architecture principles with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                     │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Pages      │  Components  │   Services   │    Hooks     │ │
│  │ (5 pages)    │  (5 reusable)│  (3 APIs)    │  (3 custom)  │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                              │                                   │
│                              │ Axios HTTP Client                │
│                              ▼                                   │
├─────────────────────────────────────────────────────────────────┤
│                    Backend (Express + TypeScript)                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      API Gateway                           │ │
│  │  (CORS, Helmet, Rate Limiting, Request Logger)            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ▼                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │  User Routes │ Profile Routes │Health Routes│Documentation│ │
│  │  (5 methods) │ (6 methods)   │  (2 methods)│ (Swagger UI) │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                              ▼                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ Controllers  │  Services    │ Repositories │  Validators  │ │
│  │ (3 ctlrs)    │  (2 services)│ (4 repos)    │  (Joi)       │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                              ▼                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   TypeORM    │    Entities  │ Migrations   │  Soft Deletes│ │
│  │    (ORM)     │   (4 models) │  (4 migrations)│            │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                              ▼                                   │
├─────────────────────────────────────────────────────────────────┤
│                     Data Layer (PostgreSQL)                      │
│  ┌────────────┬────────────┬──────────────┬────────────────┐   │
│  │   Users    │  Profiles  │  Documents   │  Audit Logs    │   │
│  │  (uuid pk) │ (uuid pk)  │  (uuid pk)   │  (uuid pk)     │   │
│  │  (10 cols) │  (9 cols)  │  (9 cols)    │  (9 cols)      │   │
│  │  (indexes) │ (indexes)  │  (indexes)   │  (indexes)     │   │
│  └────────────┴────────────┴──────────────┴────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
 │   Redis      │  │  Keycloak    │  │ Prometheus   │
 │ (Caching)    │  │ (Auth)       │  │ (Metrics)    │
 └──────────────┘  └──────────────┘  └──────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Frontend)
**Location**: `frontend/src`

- **Pages**: Homepage, Login, Signup, Dashboard
- **Components**: Button, Input, Card, Table, Layout
- **Services**: REST API clients (axios-based)
- **State**: Zustand stores for auth
- **Hooks**: Custom hooks for data fetching

**Responsibilities**:
- User interface rendering
- Client-side routing
- Form handling & validation
- API communication
- State management

### 2. API Gateway Layer (Backend)
**Location**: `backend/src/middlewares`

- Request authentication (JWT)
- CORS policy enforcement
- Security headers (Helmet)
- Rate limiting
- Request logging
- Request ID generation
- Error handling

**Responsibilities**:
- Request validation & transformation
- Security enforcement
- Performance monitoring
- Audit trail creation

### 3. Route Layer
**Location**: `backend/src/routes`

- User routes (CRUD: 5 endpoints)
- Profile routes (CRUD: 6 endpoints)
- Health routes (2 endpoints)

**Responsibilities**:
- URL path definition
- HTTP method mapping
- Route-level validation
- Middleware composition

### 4. Controller Layer
**Location**: `backend/src/controllers`

- UserController: Handles user requests
- CitizenProfileController: Handles profile requests
- HealthController: Handles health checks

**Responsibilities**:
- Request parsing
- Calling services
- Response formatting
- Status code setting

### 5. Service Layer
**Location**: `backend/src/services`

- UserService: User business logic
- CitizenProfileService: Profile business logic

**Responsibilities**:
- Complex business logic
- Data validation
- Cross-entity operations
- Audit log creation
- Caching logic

### 6. Repository Layer
**Location**: `backend/src/repositories`

- UserRepository: User data access
- CitizenProfileRepository: Profile data access
- DocumentRepository: Document data access
- AuditLogRepository: Audit log access

**Responsibilities**:
- Database query construction
- Entity hydration
- Pagination handling
- Soft delete management

### 7. Entity/Model Layer
**Location**: `backend/src/models`

- UserEntity: User table mapping
- CitizenProfileEntity: Profile table mapping
- DocumentEntity: Document table mapping
- AuditLogEntity: Audit log table mapping

**Responsibilities**:
- Table schema definition
- Column specifications
- Relationship definition
- Index strategy

### 8. Database Layer
**Location**: PostgreSQL

- 4 tables with relationships
- Soft delete columns
- JSONB fields for flexibility
- Proper indexing
- Foreign key constraints

## Data Flow

### User Creation Flow
```
1. Client (React)
   ↓ POST /api/users {email, firstName, lastName, ...}
   ↓
2. Route Handler
   → Validation middleware (Joi)
   ↓
3. Controller (UserController)
   → Create request parsing
   → Calls userService.createUser()
   ↓
4. Service (UserService)
   → Checks for duplicates
   → Creates user entity
   → Logs audit entry
   ↓
5. Repository (UserRepository)
   → Saves to database via TypeORM
   ↓
6. Database (PostgreSQL)
   → Inserts user record
   → Generates UUID
   ← Returns created entity
   ↓
7. Service Layer
   → Maps entity to DTO
   ← Returns user object
   ↓
8. Controller
   → Formats response
   → Sets 201 status
   ↓
9. Client
   ← Receives {success: true, data: {...}, metadata: {...}}
```

### Authentication Flow
```
1. Client: Login with credentials
   ↓
2. Backend: Validate credentials (mock/Keycloak)
   ↓
3. Backend: Generate JWT token
   ↓
4. Client: Store token in localStorage
   ↓
5. Subsequent Requests:
   → Include Authorization: Bearer {token}
   ↓
6. Middleware: Verify JWT signature
   ↓
7. Middleware: Extract user claims
   ↓
8. Route Handler: Access req.user with claims
   ↓
9. Service: Perform operation with user context
   ↓
10. Audit Log: Register action with userId
```

## Technology Decisions

### Backend: Node.js + Express
- **Why**: Fast, scalable, event-driven
- **TypeScript**: Type safety, IDE support
- **Express**: Battle-tested, minimal overhead
- **TypeORM**: Strong typing, migrations, relationships

### Database: PostgreSQL
- **Why**: ACID compliance, JSON support, reliability
- **Soft Deletes**: Data preservation & compliance
- **Migrations**: Schema version control
- **Indexes**: Performance optimization

### Frontend: React + Vite
- **Why**: Component-based, active ecosystem, performance
- **Vite**: Fast build, instant HMR
- **Zustand**: Minimal state manager, good for medium apps
- **React Router**: Standard routing solution

### Authentication: JWT + Keycloak
- **Why**: Stateless, scalable, industry standard
- **Keycloak**: Enterprise OIDC/OAuth2 provider
- **JWT**: Verified in middleware, no DB lookup needed

### Caching: Redis
- **Why**: In-memory speed, atomic operations
- **Use Cases**: Session caching, query result caching

### Monitoring: Prometheus + Logging
- **Prometheus**: Standard metric format, Grafana integration
- **Winston**: Structured logging, file rotation

## Security Architecture

### Authentication
1. User submits credentials
2. Backend validates (Keycloak integration ready)
3. JWT token generated with claims
4. Token signed with secret
5. Client stores in localStorage
6. Token sent in Authorization header
7. Middleware verifies signature + expiry

### Authorization
1. JWT decoded to extract claims
2. req.user populated with claims
3. Role-based middleware checks roles
4. Service layer enforces ownership

### Data Protection
1. Passwords not logged
2. Secrets in environment variables
3. Input validation before processing
4. SQL injection prevention (TypeORM)
5. CORS restricts cross-origin access
6. Rate limiting prevents abuse
7. Helmet sets security headers

### Audit Trail
1. All mutations tracked in audit_logs
2. Tracks: entity, action, user, changes, timestamp
3. Supports compliance & debugging
4. Retention via soft deletes

## Scalability Considerations

### Horizontal Scaling
- Stateless API (JWT, no sessions)
- Shared database (PostgreSQL)
- Shared cache (Redis)
- Load balancer ready (Docker/Kubernetes)

### Vertical Scaling
- Connection pooling ready
- Query optimization via indexes
- Caching strategy for hot data
- Lazy loading possible

### Future Enhancements
- Service-to-service communication
- Message queues (RabbitMQ/Kafka)
- Event sourcing
- CQRS pattern
- Microservices split
- GraphQL layer

## Testing Strategy

### Unit Tests
- Service layer logic
- Repository queries (mocked)
- Validation rules

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Form submission
- Navigation

### Tools
- Jest: Testing framework
- Supertest: HTTP assertions
- Mock DB: In-memory testing

## Deployment Architecture

### Local Development
```
docker-compose up -d
# All services: backend, frontend, postgres, redis, keycloak
```

### Docker Image
```
- Multi-stage builds (optimize size)
- Alpine base (minimal)
- Health checks (liveness + readiness)
- Non-root user (security)
```

### CI/CD Pipeline
```
Code Push → Lint & Test → Build Images → Push Registry → Deploy
```

### Kubernetes Ready
- Resource limits
- Liveness probes
- Readiness probes
- Service mesh ready
- ConfigMaps & Secrets
