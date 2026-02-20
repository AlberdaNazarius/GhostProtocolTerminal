#!/bin/bash
# Ghost Protocol Terminal - Single Command Startup
# Assumes: Bun installed, Node.js installed, npm available

echo "[GHOST_PROTOCOL] Initializing systems..."

# Check prerequisites
if ! command -v bun &> /dev/null; then
    echo "[ERROR] Bun not found. Install from https://bun.sh"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "[BACKEND] Installing dependencies..."
    cd backend && bun install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "[FRONTEND] Installing dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
echo "[BACKEND] Launching server on port 3001..."
cd backend && bun run src/index.ts &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start frontend
echo "[FRONTEND] Launching client on port 3000..."
cd frontend && npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
