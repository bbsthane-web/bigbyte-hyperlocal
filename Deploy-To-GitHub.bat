@echo off
title BigByte Systems - 1-Click GitHub Deployer
color 0b
echo ======================================================================
echo    BigByte Systems - 360 Hyperlocal Suite Deployment
echo ======================================================================
echo.

"C:\Program Files\GitHub CLI\gh.exe" auth status >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] GitHub CLI is already logged in!
    echo Deploying repository and enabling GitHub Pages...
    python deploy.py
    goto end
)

echo [!] GitHub is not yet authorized on this computer.
echo.
echo Please choose how you want to deploy:
echo   [1] Authorize in 1-click via Browser (gh auth login)
echo   [2] Paste your GitHub Personal Access Token (PAT)
echo   [3] Exit
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Opening browser to authorize GitHub...
    "C:\Program Files\GitHub CLI\gh.exe" auth login --web --git-protocol https
    python deploy.py
    goto end
)

if "%choice%"=="2" (
    echo.
    set /p gh_user="Enter your GitHub username: "
    set /p gh_tok="Enter your GitHub Personal Access Token: "
    python deploy.py %gh_user% %gh_tok% bigbyte-hyperlocal
    goto end
)

:end
echo.
echo ======================================================================
echo Press any key to exit...
pause >nul
