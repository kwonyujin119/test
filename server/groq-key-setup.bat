@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 Groq key setup (backup AI)
rem Saves the Groq API key (from console.groq.com) as the backup AI into data\config.json and tests it. The key stays on this PC only.

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
rem The server file must be 3.9 or newer (Groq support)
findstr /C:"set-groq-key" sachil_server.py >nul 2>nul
if errorlevel 1 (
  echo [ERROR] sachil_server.py in this folder is an OLD version.
  echo         1. Delete old SACHIL47-server-update zip files in your Downloads folder.
  echo         2. Download SACHIL47-server-update.zip again and extract it.
  echo         3. Copy ALL extracted files into this folder and overwrite.
  echo         Folder: %~dp0
  pause
  exit /b 1
)

echo.
echo Paste the Groq API key copied from console.groq.com - API Keys - starts with gsk_ - and press Enter.
echo Never share this key in chat, KakaoTalk or GitHub.
echo.
set "KEY="
set /p KEY=Key:
if not defined KEY (
  echo [ERROR] Nothing was pasted.
  pause
  exit /b 1
)
%PY% sachil_server.py --set-groq-key "%KEY%"
set "RC=%errorlevel%"
set "KEY="
if "%RC%"=="0" (
  echo ===============================================================
  echo  Done. The key was saved and tested.
  echo  Close the server window and start it again with start-domain.bat
  echo ===============================================================
) else (
  echo ===============================================================
  echo  The key test failed. Run this file again to see the reason,
  echo  or check the key on the API Keys page of console.groq.com
  echo ===============================================================
)
pause
