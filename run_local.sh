#!/bin/bash
# ============================================================================
# Parking Management System - Local Development Setup (Linux/macOS)
# ============================================================================
# This script automates the setup and startup of the parking management system
# Prerequisites: Docker and Docker Compose installed
# ============================================================================

set -e

echo "========================================"
echo "Parking Management System - Local Setup"
echo "========================================"
echo ""

# Check if Docker is installed
echo "[1/5] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi
docker --version
echo ""

# Check if Docker Compose is available (try v2 first, then v1)
echo "[2/5] Checking Docker Compose..."
COMPOSE_CMD=""
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    docker compose version
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    docker-compose --version
else
    echo "ERROR: Docker Compose is not available"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi
echo "Using: $COMPOSE_CMD"
echo ""

# Check if Docker daemon is running
echo "[3/5] Checking if Docker daemon is running..."
if ! docker info &> /dev/null; then
    echo "ERROR: Docker daemon is not running"
    echo "Please start Docker and try again"
    exit 1
fi
echo "Docker daemon is running"
echo ""

# Setup root environment file
echo "[4/5] Setting up environment file..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ".env created successfully"
    echo "IMPORTANT: Review .env and adjust configuration if needed"
else
    echo ".env already exists"
fi
echo ""

# Install dependencies if Node.js is available
echo "[5/5] Installing dependencies (if Node.js is available)..."
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Dependencies will be installed inside Docker containers."
else
    echo "Node.js found:"
    node --version
    
    # Install backend dependencies
    if [ -f "backend/package.json" ]; then
        if [ ! -d "backend/node_modules" ]; then
            echo "Installing backend dependencies..."
            cd backend
            if npm install; then
                echo "Backend dependencies installed"
            else
                echo "WARNING: Failed to install backend dependencies"
            fi
            cd ..
        else
            echo "Backend dependencies already installed"
        fi
    fi
    
    # Install frontend dependencies
    if [ -f "frontend/package.json" ]; then
        if [ ! -d "frontend/node_modules" ]; then
            echo "Installing frontend dependencies..."
            cd frontend
            if npm install; then
                echo "Frontend dependencies installed"
            else
                echo "WARNING: Failed to install frontend dependencies"
            fi
            cd ..
        else
            echo "Frontend dependencies already installed"
        fi
    fi
fi
echo ""

# Start Docker Compose
echo "========================================"
echo "Starting Parking Management System..."
echo "========================================"
echo "This may take a few minutes on first run (building images)..."
echo ""

$COMPOSE_CMD up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "System started successfully!"
    echo "========================================"
    echo ""
    
    # Read port values from .env file if they exist
    API_PORT=3000
    WEB_PORT=5173
    if [ -f .env ]; then
        API_PORT=$(grep -E "^API_PORT=" .env | cut -d '=' -f2 | tr -d ' ' || echo "3000")
        WEB_PORT=$(grep -E "^WEB_PORT=" .env | cut -d '=' -f2 | tr -d ' ' || echo "5173")
    fi
    
    echo "Services are now running:"
    echo "  - Frontend:  http://localhost:$WEB_PORT"
    echo "  - API:       http://localhost:$API_PORT"
    echo "  - Swagger:   http://localhost:$API_PORT/api/docs"
    echo ""
    echo "Default credentials:"
    echo "  Admin:    username: admin    password: admin123"
    echo "  Operator: username: operator password: operator123"
    echo ""
    echo "Useful commands:"
    echo "  View logs:        $COMPOSE_CMD logs -f"
    echo "  Stop services:    $COMPOSE_CMD down"
    echo "  Restart services: $COMPOSE_CMD restart"
    echo ""
    echo "Displaying service status..."
    echo ""
    $COMPOSE_CMD ps
    echo ""
    echo "========================================"
    echo "Setup Complete!"
    echo "========================================"
else
    echo ""
    echo "ERROR: Failed to start services"
    echo "Check the error messages above for details"
    exit 1
fi
