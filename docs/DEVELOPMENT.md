# UDAAN Platform - Development Scripts

## Backend

### Development
```bash
cd backend
npm install
npm run dev
```

### Build
```bash
cd backend
npm run build
npm start
```

### Database
```bash
cd backend
npm run migrate          # Run migrations
npm run migrate:generate # Generate new migration
npm run seed            # Seed test data
```

### Testing
```bash
cd backend
npm test                 # Run tests
npm test:watch         # Watch mode
npm test:coverage      # Coverage report
npm run lint           # Lint code
npm run format         # Format code
```

## Frontend

### Development
```bash
cd frontend
npm install
npm run dev
```

### Build
```bash
cd frontend
npm run build
npm preview
```

### Testing
```bash
cd frontend
npm test               # Run tests
npm test:ui          # UI mode
npm run type-check   # Type checking
npm run lint         # Lint code
npm run format       # Format code
```

## Docker Compose Stack

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend      # Specific service
```

### Rebuild Images
```bash
docker-compose up -d --build
```

### Database Seed (via Docker)
```bash
docker-compose exec backend npm run seed
```

### Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Keycloak Admin**: http://localhost:8080 (admin/admin_password)
- **PostgreSQL**: localhost:5432 (udaan_user/udaan_password_secure)
- **Redis**: localhost:6379

## Useful Commands

### Check Service Health
```bash
curl http://localhost:3000/api/health/health
curl http://localhost:3000/api/health/ready
```

### View Prometheus Metrics
```bash
curl http://localhost:9090/api/v1/query?query=http_requests_total
```

### Reset Database (Docker)
```bash
docker-compose down -v
docker-compose up -d postgres redis
```

### Shell Access
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Troubleshooting

### Service won't start
- Check logs: `docker-compose logs <service>`
- Ensure ports are available
- Check .env file configuration

### Database connection errors
- Verify PostgreSQL is running: `docker-compose ps`
- Check DATABASE_HOST matches service name

### API not responding
- Check backend health: `curl http://localhost:3000/api/health/health`
- View logs: `docker-compose logs -f backend`

### Frontend not loading
- Clear browser cache
- Check console for API errors
- Verify VITE_API_BASE_URL is correct
