@echo off
REM ============================================================================
REM Parking Management System - Local Development Setup (Windows)
REM ============================================================================
REM This script automates the setup and startup of the parking management system
REM Prerequisites: Docker Desktop installed and running
REM ============================================================================

echo ========================================
echo Parking Management System - Local Setup
echo ========================================
echo.

REM Check if Docker is installed
echo [1/5] Checking Docker installation...
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

REM Check if Docker Compose is available (try v2 first, then v1)
echo [2/5] Checking Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Docker Compose is not available
        echo Please ensure Docker Desktop is installed with Compose support
        echo.
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
    docker-compose --version
) else (
    set COMPOSE_CMD=docker compose
    docker compose version
)
echo Using: %COMPOSE_CMD%
echo.

REM Check if Docker daemon is running
echo [3/5] Checking if Docker daemon is running...
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

REM Setup root environment file
echo [4/5] Setting up environment file...
if not exist ".env" (
    echo Creating .env from .env.example...
    copy ".env.example" ".env" >nul
    echo .env created successfully
    echo IMPORTANT: Review .env and adjust configuration if needed
) else (
    echo .env already exists
)
echo.

REM Install dependencies if Node.js is available
echo [5/5] Installing dependencies (if Node.js is available)...
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Dependencies will be installed inside Docker containers.
) else (
    echo Node.js found:
    node --version
    
    REM Install backend dependencies
    if exist "backend\package.json" (
        if not exist "backend\node_modules" (
            echo Installing backend dependencies...
            cd backend
            call npm install
            if errorlevel 1 (
                echo WARNING: Failed to install backend dependencies
                cd ..
            ) else (
                echo Backend dependencies installed
                cd ..
            )
        ) else (
            echo Backend dependencies already installed
        )
    )
    
    REM Install frontend dependencies
    if exist "frontend\package.json" (
        if not exist "frontend\node_modules" (
            echo Installing frontend dependencies...
            cd frontend
            call npm install
            if errorlevel 1 (
                echo WARNING: Failed to install frontend dependencies
                cd ..
            ) else (
                echo Frontend dependencies installed
                cd ..
            )
        ) else (
            echo Frontend dependencies already installed
        )
    )
)
echo.

REM Start Docker Compose
echo ========================================
echo Starting Parking Management System...
echo ========================================
echo This may take a few minutes on first run (building images)...
echo.

%COMPOSE_CMD% up -d --build

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

REM Read port values from .env file if they exist
set API_PORT=3000
set WEB_PORT=5173
if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in ('findstr /r "^API_PORT=" .env') do set API_PORT=%%b
    for /f "tokens=1,2 delims==" %%a in ('findstr /r "^WEB_PORT=" .env') do set WEB_PORT=%%b
)

echo Services are now running:
echo   - Frontend:  http://localhost:%WEB_PORT%
echo   - API:       http://localhost:%API_PORT%
echo   - Swagger:   http://localhost:%API_PORT%/api/docs
echo.
echo Default credentials:
echo   Admin:    username: admin    password: admin123
echo   Operator: username: operator password: operator123
echo.
echo Useful commands:
echo   View logs:        %COMPOSE_CMD% logs -f
echo   Stop services:    %COMPOSE_CMD% down
echo   Restart services: %COMPOSE_CMD% restart
echo.
echo Press any key to view service status...
pause >nul

%COMPOSE_CMD% ps

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
pause
