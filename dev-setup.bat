@echo off
echo Setting up Widget development environment...

echo.
echo === Setting up Backend ===
cd backend
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo Please update backend\.env with your database credentials
)

echo.
echo === Setting up Frontend ===
cd ..\frontend

echo Installing Node.js dependencies...
npm install

if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
    echo Please update frontend\.env if needed
)

echo.
echo === Setup Complete! ===
echo.
echo To start development:
echo 1. Backend: cd backend && run-dev.bat
echo 2. Frontend: cd frontend && npm run dev
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:5173
echo.
pause
