@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 fixed domain setup
rem ---- Fixed address for this server (Cloudflare domain sachil47.com) ----
set "HOST=app.sachil47.com"
set "TUN=sachil"

set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo [ERROR] Python not found.
  pause
  exit /b 1
)
if not exist cloudflared.exe (
  echo [ERROR] cloudflared.exe not found in this folder. Run start.bat once first, then run this file again.
  pause
  exit /b 1
)
if not exist sachil_server.py (
  echo [ERROR] Put this file in the SACHIL folder next to sachil_server.py.
  pause
  exit /b 1
)

echo.
echo [1/4] Cloudflare login
if exist "%USERPROFILE%\.cloudflared\cert.pem" (
  echo       Already logged in. Skipping.
) else (
  echo       A browser window will open. Log in to Cloudflare, click sachil47.com, then click Authorize.
  echo       Come back to this window after the browser says Success.
  cloudflared.exe tunnel login
  if not exist "%USERPROFILE%\.cloudflared\cert.pem" (
    echo [ERROR] Login was not completed. Run this file again.
    pause
    exit /b 1
  )
)

echo.
echo [2/4] Create tunnel "%TUN%"
cloudflared.exe tunnel info %TUN% >nul 2>nul
if errorlevel 1 (
  cloudflared.exe tunnel create %TUN%
  if errorlevel 1 (
    echo [ERROR] Could not create the tunnel. Send a screenshot of this window.
    pause
    exit /b 1
  )
) else (
  echo       Tunnel "%TUN%" already exists. Reusing it.
)

echo.
echo [3/4] Connect %HOST% to the tunnel
cloudflared.exe tunnel route dns --overwrite-dns %TUN% %HOST%
if errorlevel 1 (
  echo [ERROR] Could not create the DNS record for %HOST%. Check that sachil47.com is Active in Cloudflare.
  pause
  exit /b 1
)

echo.
echo [4/4] Save the address in data\config.json
%PY% sachil_server.py --set-url https://%HOST%

echo.
echo ===============================================================
echo  Done. From now on, start the server with start-domain.bat
echo  Address: https://%HOST%
echo ===============================================================
pause
