#!/bin/bash
# ...existing code...
# Start backend and frontend from the repository root
cd "$(dirname "$0")"
(cd backend && npm install && npm start) &
npm install
npm run dev &
wait
# ...existing code...