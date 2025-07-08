# Environment Setup Guide

## Overview

This app supports multiple environments:
- **Development**: Uses Neon development branch, debug mode enabled
- **Production**: Uses Neon production branch, optimized for performance

## Database URLs

**Development:**
```
postgresql://neondb_owner:npg_t41hdYVsXMfy@ep-lively-surf-a2fx7a1g-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Production:**
```
postgresql://neondb_owner:npg_t41hdYVsXMfy@ep-blue-surf-a2rk6ul3-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Running the Backend

### Development Mode
```bash
cd backend
# Option 1: Using batch script
run-dev.bat

# Option 2: Set environment manually
set ENVIRONMENT=development
python main.py
```

### Production Mode
```bash
cd backend
# Option 1: Using batch script
run-prod.bat

# Option 2: Set environment manually
set ENVIRONMENT=production
python main.py
```

## Running the Frontend

### Development
```bash
npm run dev
# Uses .env.development or .env.local
```

### Production Build
```bash
npm run build
# Uses .env.production
```

## Environment Files

### Backend
- `.env` - Default/local development
- `.env.development` - Development environment
- `.env.production` - Production environment

### Frontend
- `.env.local` - Local development (highest priority)
- `.env.development` - Development mode
- `.env.production` - Production builds

## Database Access

### Via psql (Command Line)

**Development:**
```bash
psql 'postgresql://neondb_owner:npg_t41hdYVsXMfy@ep-lively-surf-a2fx7a1g-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

**Production:**
```bash
psql 'postgresql://neondb_owner:npg_t41hdYVsXMfy@ep-blue-surf-a2rk6ul3-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### Via Neon Console
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Choose the appropriate branch (development/production)
4. Use the SQL Editor tab

## Common Queries

```sql
-- View all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View all users
SELECT * FROM users;

-- Count users by environment
SELECT COUNT(*) as user_count FROM users;

-- View recent registrations
SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 10;
```

## Deployment

### Render
- Production environment is automatically set via `render.yaml`
- Environment variables are configured in Render dashboard
- Uses production database branch

### Environment Variables for Render
Set these in your Render service dashboard:
- `DATABASE_URL` - Production Neon URL
- `JWT_SECRET_KEY` - Strong production secret
- `CORS_ORIGINS` - Your frontend domain
- `ENVIRONMENT` - "production"
- `DEBUG` - "false"
