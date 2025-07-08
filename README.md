# Widget Application

A full-stack web application with React frontend and FastAPI backend, using Neon PostgreSQL database.

## Project Structure

```
Widget/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── backend/           # FastAPI + SQLAlchemy backend
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── auth.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── render.yaml       # Deployment configuration
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and pip
- Neon PostgreSQL database account

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # Linux/Mac
   ```

5. Update `.env` with your Neon database URL and JWT secret

6. Run development server:
   ```bash
   python main.py
   # or
   run-dev.bat  # Windows
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # Linux/Mac
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:5173
- API Documentation: http://localhost:8000/docs

## Deployment

This project is configured for deployment on Render.com. See `render.yaml` for configuration details.

## Environment Management

The project supports multiple environments:

- **Development**: Uses development database and debug mode
- **Production**: Uses production database with optimized settings

Set the `ENVIRONMENT` variable in your `.env` files to switch between environments.

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Styled Components

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- pg8000 (PostgreSQL driver)

### Database
- Neon PostgreSQL

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request