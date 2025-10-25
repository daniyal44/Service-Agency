@REM @echo off
@REM REM Start backend from the repo's backend folder and start frontend (vite) from repo root
@REM start "Backend" cmd /k "cd /d \"%~dp0backend\" && npm install && npm start"
@REM start "Frontend" cmd /k "cd /d \"%~dp0\" && npm install && npm run dev"
