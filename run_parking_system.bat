@echo off
REM ============================================================================
REM Parking Management System - Windows Runner Script
REM ============================================================================
REM This script automates the setup and startup of the parking management system
REM Prerequisites: Docker Desktop installed and running
REM ============================================================================

echo ========================================
echo Parking Management System - Setup
echo ========================================
echo.

REM Check if Docker is installed
echo [1/6] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)
docker --version
echo.

REM Check if Docker Compose is available
echo [2/6] Checking Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose is not available
    echo Please ensure Docker Desktop is installed with Compose V2
    echo.
    pause
    exit /b 1
)
echo Docker Compose found:
docker compose version
echo.

REM Check if Docker daemon is running
echo [3/6] Checking if Docker daemon is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker daemon is not running
    echo Please start Docker Desktop and try again
    echo.
    pause
    exit /b 1
)
echo Docker daemon is running
echo.

REM Setup environment files
echo [4/6] Setting up environment files...

if not exist "backend\.env" (
    echo Creating backend\.env from backend\.env.example...
    copy "backend\.env.example" "backend\.env" >nul
    echo Backend .env created
) else (
    echo Backend .env already exists
)

if not exist "frontend\.env" (
    echo Creating frontend\.env from frontend\.env.example...
    copy "frontend\.env.example" "frontend\.env" >nul
    echo Frontend .env created
) else (
    echo Frontend .env already exists
)
echo.

REM Check for Node.js (optional for local development)
echo [5/6] Checking Node.js installation (optional for local dev)...
node --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Node.js not found. Docker will handle dependencies.
    echo For local development, install Node.js from: https://nodejs.org
) else (
    echo Node.js found:
    node --version
    
    REM Install dependencies if package.json exists and node_modules doesn't
    if exist "backend\package.json" (
        if not exist "backend\node_modules" (
            echo Installing backend dependencies...
            cd backend
            call npm install
            cd ..
        ) else (
            echo Backend dependencies already installed
        )
    )
    
    if exist "frontend\package.json" (
        if not exist "frontend\node_modules" (
            echo Installing frontend dependencies...
            cd frontend
            call npm install
            cd ..
        ) else (
            echo Frontend dependencies already installed
        )
    )
)
echo.

REM Start Docker Compose
echo [6/6] Starting Parking Management System with Docker Compose...
echo This may take a few minutes on first run (building images)...
echo.

docker compose up -d --build

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start services
    echo Check the error messages above for details
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo System started successfully!
echo ========================================
echo.
echo Services are now running:
echo   - Frontend:  http://localhost:3001
echo   - API:       http://localhost:3000
echo   - Swagger:   http://localhost:3000/api/docs
echo.
echo Default credentials:
echo   Admin:    username: admin    password: admin123
echo   Operator: username: operator password: operator123
echo.
echo To view logs:          docker compose logs -f
echo To stop services:      docker compose down
echo To restart services:   docker compose restart
echo.
echo Press any key to view service status...
pause >nul

docker compose ps

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
pause
