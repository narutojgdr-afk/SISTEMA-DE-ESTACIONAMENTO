#!/bin/bash
# ============================================================================
# Parking Management System - Local Development (No Docker - Linux/macOS)
# ============================================================================
# This script runs the parking system locally without Docker
# Prerequisites: Node.js 18+ and npm installed, PostgreSQL 15+ running
# ============================================================================

set -e

echo "========================================"
echo "Parking Management System - No Docker Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi
echo "Node.js version:"
node --version
echo ""

# Check if npm is installed
echo "[2/6] Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    echo "npm should be installed with Node.js"
    exit 1
fi
echo "npm version:"
npm --version
echo ""

# Setup root environment file
echo "[3/6] Setting up environment files..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating root .env from .env.example..."
        cp .env.example .env
        echo "Root .env created successfully"
    else
        echo "WARNING: .env.example not found in root directory"
    fi
else
    echo "Root .env already exists"
fi

# Setup backend environment file
if [ ! -f backend/.env ]; then
    if [ -f backend/.env.example ]; then
        echo "Creating backend/.env from backend/.env.example..."
        cp backend/.env.example backend/.env
        echo "Backend .env created successfully"
        echo "IMPORTANT: Ensure PostgreSQL is running and credentials in backend/.env are correct"
    else
        echo "WARNING: backend/.env.example not found"
    fi
else
    echo "Backend .env already exists"
fi

# Setup frontend environment file
if [ ! -f frontend/.env ]; then
    if [ -f frontend/.env.example ]; then
        echo "Creating frontend/.env from frontend/.env.example..."
        cp frontend/.env.example frontend/.env
        echo "Frontend .env created successfully"
    else
        echo "WARNING: frontend/.env.example not found"
    fi
else
    echo "Frontend .env already exists"
fi
echo ""

# Install backend dependencies
echo "[4/6] Installing backend dependencies..."
if [ -f backend/package.json ]; then
    cd backend
    echo "Installing backend packages..."
    if npm install; then
        echo "Backend dependencies installed successfully"
    else
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
    cd ..
else
    echo "ERROR: backend/package.json not found"
    exit 1
fi
echo ""

# Install frontend dependencies
echo "[5/6] Installing frontend dependencies..."
if [ -f frontend/package.json ]; then
    cd frontend
    echo "Installing frontend packages..."
    if npm install; then
        echo "Frontend dependencies installed successfully"
    else
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
else
    echo "ERROR: frontend/package.json not found"
    exit 1
fi
echo ""

# Read port values from .env files
API_PORT=3000
WEB_PORT=5173
if [ -f backend/.env ]; then
    API_PORT=$(grep -E "^PORT=" backend/.env | cut -d '=' -f2 | tr -d ' ' 2>/dev/null || echo "3000")
fi
if [ -f .env ]; then
    API_PORT_ROOT=$(grep -E "^API_PORT=" .env | cut -d '=' -f2 | tr -d ' ' 2>/dev/null || echo "")
    if [ ! -z "$API_PORT_ROOT" ]; then
        API_PORT=$API_PORT_ROOT
    fi
fi

echo "[6/6] Starting services..."
echo ""
echo "========================================"
echo "System is starting..."
echo "========================================"
echo ""
echo "IMPORTANT NOTES:"
echo "  - Make sure PostgreSQL is running on localhost:5432"
echo "  - Check backend/.env for correct database credentials"
echo "  - Backend API will start on port $API_PORT"
echo "  - Frontend will start on port $WEB_PORT"
echo ""

# Trap to handle cleanup on script termination
cleanup() {
    echo ""
    echo "========================================"
    echo "Stopping services..."
    echo "========================================"
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo "Services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend API..."
cd backend
npm run start:dev &> ../backend.log &
BACKEND_PID=$!
cd ..
echo "Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend..."
cd frontend
npm run dev &> ../frontend.log &
FRONTEND_PID=$!
cd ..
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "========================================"
echo "Services Started Successfully!"
echo "========================================"
echo ""
echo "Services are running in the background:"
echo "  - Backend API (PID: $BACKEND_PID) on port $API_PORT"
echo "  - Frontend (PID: $FRONTEND_PID) on port $WEB_PORT"
echo ""
echo "Access the application at:"
echo "  - Frontend:  http://localhost:$WEB_PORT"
echo "  - API:       http://localhost:$API_PORT"
echo "  - Swagger:   http://localhost:$API_PORT/api/docs"
echo ""
echo "Default credentials:"
echo "  Admin:    username: admin    password: admin123"
echo "  Operator: username: operator password: operator123"
echo ""
echo "Logs are being written to:"
echo "  - Backend:  backend.log"
echo "  - Frontend: frontend.log"
echo ""
echo "To view logs in real-time:"
echo "  tail -f backend.log"
echo "  tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""
echo "========================================"
echo ""

# Wait for both processes
wait
