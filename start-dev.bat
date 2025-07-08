@echo off
echo Starting Widget application in development mode...

echo Starting backend...
start "Widget Backend" cmd /k "cd backend && .venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Widget Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting up...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to close this window...
pause > nul
