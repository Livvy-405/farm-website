#!/bin/bash
echo "🌿 Starting Green Hollow Farm..."

# Start backend
cd ~/Desktop/farm-website/backend && npm run dev &
BACKEND_PID=$!
echo "✅ Backend started (PID $BACKEND_PID)"

# Wait for backend to be ready
sleep 3

# Start frontend
cd ~/Desktop/farm-website && npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID $FRONTEND_PID)"

echo "🚀 Both servers running. Press Ctrl+C to stop both."

# Stop both on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
