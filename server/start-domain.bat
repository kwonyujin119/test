@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set SACHIL_LOOP=1
title SACHIL:47 server (fixed domain, auto update)
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo [ERROR] Python not found. Install Python 3 from https://www.python.org/downloads/
  echo         and check "Add python.exe to PATH" during install.
  pause
  exit /b 1
)
if not exist cloudflared.exe (
  echo [ERROR] cloudflared.exe not found. Run domain-setup.bat first.
  pause
  exit /b 1
)
:run
%PY% sachil_server.py --named
set "RC=%errorlevel%"
rem 75 = the server downloaded a new version of itself: start again right away
if "%RC%"=="75" (
  echo [update] Restarting with the new server file ...
  goto run
)
rem The new file stopped within its first minute: put the previous file back and start again
if exist data\update_verify.flag (
  if exist sachil_server.py.bak (
    echo [update] The new server file stopped. Restoring the previous file ...
    copy /y sachil_server.py.bak sachil_server.py >nul
    move /y data\update_verify.flag data\update_rolled_back.flag >nul
    goto run
  )
)
pause
