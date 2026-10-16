@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SACHIL:47 AI key setup
rem Saves the Claude API key into data\config.json and tests it. The key stays on this PC only.

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
echo Paste the Claude API key (starts with sk-ant-) and press Enter.
echo Never share this key in chat, KakaoTalk or GitHub.
echo.
set "KEY="
set /p KEY=Key:
if not defined KEY (
  echo [ERROR] Nothing was pasted.
  pause
  exit /b 1
)
%PY% sachil_server.py --set-ai-key %KEY%
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
  echo  or check the key and billing at console.anthropic.com
  echo ===============================================================
)
pause
