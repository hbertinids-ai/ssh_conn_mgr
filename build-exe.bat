@echo off
echo Building SSH Connection Manager...
call npm run build:exe
echo.
echo Build complete! 
echo Executable location: .\release\ssh-connection-manager-win32-x64\ssh-connection-manager.exe
echo.
pause