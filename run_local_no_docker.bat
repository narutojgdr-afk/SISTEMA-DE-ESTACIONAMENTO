@echo off
REM ============================================================================
REM Parking Management System - Local Development (No Docker - Windows)
REM ============================================================================
REM This script runs the parking system locally without Docker
REM Prerequisites: Node.js 18+ and npm installed, PostgreSQL 15+ running
REM ============================================================================

echo ========================================
echo Parking Management System - No Docker Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js version:
node --version
echo.

REM Check if npm is installed
echo [2/6] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo npm should be installed with Node.js
    echo.
    pause
    exit /b 1
)
echo npm version:
npm --version
echo.

REM Setup root environment file
echo [3/6] Setting up environment files...
if not exist ".env" (
    if exist ".env.example" (
        echo Creating root .env from .env.example...
        copy ".env.example" ".env" >nul
        echo Root .env created successfully
    ) else (
        echo WARNING: .env.example not found in root directory
    )
) else (
    echo Root .env already exists
)

REM Setup backend environment file
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        echo Creating backend/.env from backend/.env.example...
        copy "backend\.env.example" "backend\.env" >nul
        echo Backend .env created successfully
        echo IMPORTANT: Ensure PostgreSQL is running and credentials in backend/.env are correct
    ) else (
        echo WARNING: backend/.env.example not found
    )
) else (
    echo Backend .env already exists
)

REM Setup frontend environment file
if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        echo Creating frontend/.env from frontend/.env.example...
        copy "frontend\.env.example" "frontend\.env" >nul
        echo Frontend .env created successfully
    ) else (
        echo WARNING: frontend/.env.example not found
    )
) else (
    echo Frontend .env already exists
)
echo.

REM Install backend dependencies
echo [4/6] Installing backend dependencies...
if exist "backend\package.json" (
    cd backend
    echo Installing backend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo Backend dependencies installed successfully
    cd ..
) else (
    echo ERROR: backend/package.json not found
    pause
    exit /b 1
)
echo.

REM Install frontend dependencies
echo [5/6] Installing frontend dependencies...
if exist "frontend\package.json" (
    cd frontend
    echo Installing frontend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo Frontend dependencies installed successfully
    cd ..
) else (
    echo ERROR: frontend/package.json not found
    pause
    exit /b 1
)
echo.

REM Read port values from .env files
set API_PORT=3000
set WEB_PORT=5173
if exist "backend\.env" (
    for /f "tokens=1,2 delims==" %%a in ('findstr /r "^PORT=" backend\.env 2^>nul') do set API_PORT=%%b
)
if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in ('findstr /r "^API_PORT=" .env 2^>nul') do set API_PORT=%%b
    for /f "tokens=1,2 delims==" %%a in ('findstr /r "^WEB_PORT=" .env 2^>nul') do set WEB_PORT=%%b
)

echo [6/6] Starting services...
echo.
echo ========================================
echo System is starting...
echo ========================================
echo.
echo IMPORTANT NOTES:
echo   - Make sure PostgreSQL is running on localhost:5432
echo   - Check backend/.env for correct database credentials
echo   - Backend API will start on port %API_PORT%
echo   - Frontend will start on port %WEB_PORT%
echo.
echo Services starting in separate windows...
echo.

REM Start backend in a new window
start "Parking System - Backend API" cmd /k "cd /d %~dp0backend && npm run start:dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "Parking System - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo Services Started Successfully!
echo ========================================
echo.
echo Two new windows have been opened:
echo   1. Backend API (NestJS) on port %API_PORT%
echo   2. Frontend (React/Vite) on port %WEB_PORT%
echo.
echo Once started, access the application at:
echo   - Frontend:  http://localhost:%WEB_PORT%
echo   - API:       http://localhost:%API_PORT%
echo   - Swagger:   http://localhost:%API_PORT%/api/docs
echo.
echo Default credentials:
echo   Admin:    username: admin    password: admin123
echo   Operator: username: operator password: operator123
echo.
echo To stop the services:
echo   Close both terminal windows or press Ctrl+C in each window
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
pause
