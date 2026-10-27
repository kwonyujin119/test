@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 album password setup
rem Sets the password of the photo album page (https://kwonyujin119.github.io/test3/).
rem The password is stored in data\config.json as a hash only. Until one is set, only the admin code opens the album.

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
rem The server file must be 15.8 or newer (album API)
findstr /C:"set-album-code" sachil_server.py >nul 2>nul
if errorlevel 1 (
  echo [ERROR] sachil_server.py in this folder is an OLD version ^(needs 15.8 or newer^).
  echo         Wait for the automatic update ^(a few minutes^), or download
  echo         SACHIL47-server-update.zip again and copy the files into this folder.
  echo         Folder: %~dp0
  pause
  exit /b 1
)

echo.
echo Type the new album password (4 characters or more) and press Enter.
echo Both of you will use this password on the album page.
echo Leave it empty and press Enter to remove the password (admin code only).
echo.
set "CODE="
set /p CODE=Password:
%PY% sachil_server.py --set-album-code "%CODE%"
set "RC=%errorlevel%"
set "CODE="
if "%RC%"=="0" (
  echo ===============================================================
  echo  Done. The running server uses the new password from the next
  echo  login on. Phones already logged in stay logged in until they
  echo  log out. If the new password is refused, restart the server.
  echo ===============================================================
) else (
  echo ===============================================================
  echo  Not saved. Run this file again and type 4 or more characters.
  echo ===============================================================
)
pause
