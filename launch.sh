#!/bin/bash

echo "🚀 ZillGO One-Click Launcher"
echo "---------------------------"

# 1. Kill any existing processes on ports 3001 and 5001
echo "🧹 Cleaning up ports..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null

# 2. Start the Backend
echo "📡 Starting Backend (Port 5001)..."
cd server
node index.js &
BACKEND_PID=$!
cd ..

# 3. Start the Frontend
echo "🌐 Starting Frontend (Port 3001)..."
npm run dev &
FRONTEND_PID=$!

echo "---------------------------"
echo "✅ ZillGO is now running!"
echo "🔗 Website: http://localhost:3001"
echo "🛠️ Backend: http://localhost:5001"
echo "---------------------------"
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
