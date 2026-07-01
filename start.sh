#!/bin/sh

echo "Starting TalentAI (HuggingFace Spaces)"

# Start backend on port 3001
export PORT=3001
cd /app/backend
npm run start:prod &
BACKEND_PID=$!

# Wait briefly for backend to initialize
sleep 3

# Start frontend on port 7860 (HuggingFace requirement)
export PORT=7860
cd /app/frontend
npm start &
FRONTEND_PID=$!

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
