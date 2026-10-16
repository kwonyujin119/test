@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 tunnel token setup
rem Use this only if domain-setup.bat could not finish the Cloudflare login.
set "HOST=app.sachil47.com"

set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo [ERROR] Python not found.
  pause
  exit /b 1
)
if not exist sachil_server.py (
  echo [ERROR] Put this file in the SACHIL folder next to sachil_server.py.
  pause
  exit /b 1
)

echo.
echo Paste the install command (or token) copied from the Cloudflare dashboard,
echo then press Enter. It starts with  cloudflared.exe service install eyJ...
echo.
set "TOKEN="
set /p TOKEN=Token:
if not defined TOKEN (
  echo [ERROR] Nothing was pasted.
  pause
  exit /b 1
)
%PY% sachil_server.py --set-token %TOKEN%
if errorlevel 1 (
  pause
  exit /b 1
)
%PY% sachil_server.py --set-url https://%HOST%

echo.
echo ===============================================================
echo  Done. Start the server with start-domain.bat
echo  Address: https://%HOST%
echo ===============================================================
pause
