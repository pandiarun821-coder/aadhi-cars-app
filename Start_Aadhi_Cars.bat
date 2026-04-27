@echo off
title Aadhi Cars Production Server
cd /d "%~dp0"
set NODE_ENV=production
set PORT=3000

echo ===================================================
echo    Aadhi Cars Pvt Ltd - Management System Server   
echo ===================================================
echo.
echo Starting securely... Please DO NOT close this window.
echo The application will automatically open in your browser.
echo.

:: Open the browser immediately
start http://localhost:3000

:: Start the public internet link in a robust retry loop
echo Starting Public Link at https://aadhicars-erp.loca.lt...
start "Aadhi Cars Public Tunnel" cmd /c "%~dp0Start_Tunnel.bat"

:: Run the production server
call npm run start

pause
