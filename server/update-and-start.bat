@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 update + start

if not exist sachil_server.py (
  echo [ERROR] Put this file in the SACHIL folder ^(the 47 folder on drive D^) next to sachil_server.py and run again.
  pause
  exit /b 1
)

echo [1/3] Backing up current server file ...
copy /y sachil_server.py sachil_server.py.bak >nul

echo [2/3] Downloading the new server file from GitHub ...
curl -L --fail -o sachil_server.new https://raw.githubusercontent.com/kwonyujin119/test/main/server/sachil_server.py
if errorlevel 1 (
  echo [ERROR] Download failed. The old server file is kept. Check the internet connection and run again.
  if exist sachil_server.new del sachil_server.new
  pause
  exit /b 1
)
move /y sachil_server.new sachil_server.py >nul
echo        Done. Old file saved as sachil_server.py.bak

echo [3/3] Starting the server ...
if not exist start.bat (
  echo [ERROR] start.bat not found in this folder.
  pause
  exit /b 1
)
call start.bat
