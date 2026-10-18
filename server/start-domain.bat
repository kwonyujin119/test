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
set /a FAILS=0
:run
%PY% sachil_server.py --named
set "RC=%errorlevel%"
rem 75 = the server downloaded a new version of itself: start again right away
if "%RC%"=="75" (
  set /a FAILS=0
  rem V138: the server also downloaded a newer start-domain.bat - swap it in and start over with it
  if exist start-domain.new.bat (
    echo [update] Updating start-domain.bat ...
    start "" cmd /c "timeout /t 2 /nobreak >nul & move /y start-domain.new.bat start-domain.bat >nul & start "" start-domain.bat"
    exit
  )
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
rem V138: 0 = closed on purpose. Anything else = the server crashed: wait and start again (stop after 5 crashes in a row)
if not "%RC%"=="0" (
  set /a FAILS+=1
  call :retry
  if not errorlevel 1 goto run
)
pause
exit /b

:retry
if %FAILS% GEQ 5 (
  echo [ERROR] The server stopped 5 times in a row ^(code %RC%^). Check the messages above, then run this file again.
  exit /b 1
)
echo [restart] The server stopped ^(code %RC%^). Starting again in 20 seconds ... ^(%FAILS%/5^)
timeout /t 20 /nobreak >nul
exit /b 0
