# U.D.A.A.N Platform - Local Development Setup Guide

## ✅ Completed Steps

- ✅ Backend dependencies installed (529 packages)
- ✅ Frontend dependencies installed (290 packages)  
- ✅ Environment files created (.env for backend and frontend)

## ⚙️ Prerequisites Required

### 1. PostgreSQL Database
**Download & Install:**
- Visit: https://www.postgresql.org/download/windows/
- Version: 15.x or higher
- During installation, remember the **postgres** password you set

**Create Database & User:**
```sql
-- Using pgAdmin or psql:

CREATE USER udaan_user WITH PASSWORD 'udaan_password_secure';
CREATE DATABASE udaan_db OWNER udaan_user;
GRANT ALL PRIVILEGES ON DATABASE udaan_db TO udaan_user;

-- Grant schema privileges:
GRANT ALL ON SCHEMA public TO udaan_user;
```

**Or using psql command line:**
```bash
# Login to postgres
psql -U postgres

# Run the commands above
```

### 2. Redis Cache
**Download & Install:**
- **Option A (Windows):** https://github.com/microsoftarchive/redis/releases
- **Option B (Chocolatey):** `choco install redis-64`

**Verify Redis installed:**
```bash
redis-cli ping
# Should return: PONG
```

## 🚀 Running the Backend

### Terminal 1 - Start Backend Server
```powershell
cd c:\Users\krish\Desktop\hackathon\UDAAN\backend

# Run in development mode
npm run dev
```

**Expected output:**
```
Server running on 0.0.0.0:3000 in development mode
API docs available at http://localhost:3000/api/docs
```

### Backend is ready when you see:
✅ "Database connection established"
✅ "Server running on 0.0.0.0:3000"
✅ No errors in console

## 🎨 Running the Frontend

### Terminal 2 - Start Frontend Dev Server  
```powershell
cd c:\Users\krish\Desktop\hackathon\UDAAN\frontend

# Run dev server
npm run dev
```

**Expected output:**
```
VITE v5.0.8 ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

## 🌐 Access Your Application

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend API** | http://localhost:3000 | REST API endpoints |
| **Swagger Docs** | http://localhost:3000/api/docs | API documentation |
| **Health Check** | http://localhost:3000/api/health/health | API health status |
| **Metrics** | http://localhost:3000/metrics | Prometheus metrics |

## 📋 Database Setup

### Automatic Schema Creation
The backend will automatically create all tables on first run via TypeORM synchronization.

**Tables created:**
- `user` - User accounts and authentication
- `citizen_profile` - Citizen information and documents
- `document` - Document metadata
- `audit_log` - Audit trail of all operations

### Manual Migration (Optional)
```bash
cd backend
npm run migrate
```

### Seed Database with Test Data
```bash
cd backend
npm run build
node dist/scripts/seed.js
```

This creates:
- 2 test users (user@example.com, admin@example.com)
- 1 citizen profile with documents

## 🔐 Default Credentials

### Test User
- **Email:** user@example.com
- **Password:** password (set in seed script)

### Admin User
- **Email:** admin@example.com
- **Password:** password (set in seed script)

## ✅ Verification Checklist

After starting both servers, verify everything works:

```bash
# 1. Check backend is running
curl http://localhost:3000/api/health/health

# 2. Check frontend is accessible
# Open http://localhost:5173 in your browser

# 3. Check database connection
# Should see users in dashboard after login

# 4. Check metrics endpoint
curl http://localhost:3000/metrics

# 5. Access Swagger API docs
# Visit http://localhost:3000/api/docs
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Useful Commands

### Backend
```bash
cd backend

npm run dev              # Start development server
npm run build          # Compile TypeScript
npm test               # Run unit tests
npm run lint           # Check code quality
npm run format         # Format code
npm run migrate        # Run database migrations
```

### Frontend
```bash
cd frontend

npm run dev            # Start dev server
npm run build          # Build for production
npm test               # Run tests
npm run lint           # Check code quality
npm run format         # Format code
npm run type-check     # Check TypeScript types
```

## 🐛 Troubleshooting

### Problem: "Cannot connect to database"
**Solution:**
1. Verify PostgreSQL is running
   ```bash
   psql -U udaan_user -d udaan_db -c "\dt"
   ```
2. Check credentials in `backend/.env`
3. Verify database exists:
   ```sql
   psql -U postgres -l | grep udaan_db
   ```

### Problem: "Redis connection failed"
**Solution:**
1. Verify Redis is running
   ```bash
   redis-cli ping
   ```
2. Check Redis password in `backend/.env`

### Problem: Port 3000 already in use
**Solution:**
```powershell
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or change port in backend/.env: PORT=3001
```

### Problem: Port 5173 already in use
**Solution:**
```bash
cd frontend
npm run dev -- --port 5174
```

## 📦 Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=udaan_user
DATABASE_PASSWORD=udaan_password_secure
DATABASE_NAME=udaan_db
REDIS_HOST=localhost
REDIS_PASSWORD=redis_password
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=U.D.A.A.N Platform
```

## 🐳 Still Want Docker?

If you want to use Docker instead:

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop
2. Restart your computer
3. Run:
   ```bash
   docker compose up -d
   ```

## 📚 Further Documentation

- [Main README](./README.md) - Project overview
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Development Guide](./docs/DEVELOPMENT.md) - Dev workflows
- [Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md) - Features completed

## 💡 Tips

- Keep both terminal windows open while developing
- Backend logs will show requests in real-time
- Frontend hot-reloads on file changes
- Use `npm run build` in backend before testing production builds
- Check Swagger docs for all available API endpoints

---

**All issues resolved!** Your project is ready to develop locally. 🎉
