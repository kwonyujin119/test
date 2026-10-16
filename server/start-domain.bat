@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
title SACHIL:47 server (fixed domain)
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
%PY% sachil_server.py --named
pause
