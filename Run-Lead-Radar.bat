@echo off
chcp 65001 >nul
title BigByte Hyperlocal Lead Radar
cls
echo ===================================================================
echo     📡  BIGBYTE SYSTEMS - HYPERLOCAL LEAD RADAR (MULTI-AGENT)
echo     Autonomous Harvester, Auditor, Pitch Strategist & Courier
echo ===================================================================
echo.
echo Select an operation:
echo   [1] Scan Dentists in Thane West
echo   [2] Scan Interior Designers in Majiwada Thane
echo   [3] Scan Dermatologists & Skin Clinics in Naupada Thane
echo   [4] Scan Luxury Salons & Spas in Ghodbunder Road
echo   [5] Enter Custom Query (e.g. "Chartered Accountants in Thane")
echo   [6] Play Video Sales Presentation & Demo (With Voiceover)
echo   [7] Play VoiceAI Receptionist Interactive Demo (Simulated Call)
echo   [8] Open Latest Lead Dashboard
echo   [9] Exit
echo.
set /p opt="Enter your choice (1-9): "

if "%opt%"=="1" (
    python lead_radar.py --query "Dentists in Thane West" --depth 1 --open
    pause
    exit /b
)
if "%opt%"=="2" (
    python lead_radar.py --query "Interior Designers in Majiwada Thane" --depth 1 --open
    pause
    exit /b
)
if "%opt%"=="3" (
    python lead_radar.py --query "Dermatologists in Naupada Thane" --depth 1 --open
    pause
    exit /b
)
if "%opt%"=="4" (
    python lead_radar.py --query "Luxury Salons in Ghodbunder Road Thane" --depth 1 --open
    pause
    exit /b
)
if "%opt%"=="5" (
    set /p custom_q="Enter search query: "
    python lead_radar.py --query "%custom_q%" --depth 1 --open
    pause
    exit /b
)
if "%opt%"=="6" (
    start "" "video_pitch_demo.html"
    exit /b
)
if "%opt%"=="7" (
    start "" "voice_agent_demo.html"
    exit /b
)
if "%opt%"=="8" (
    start "" "dashboard.html"
    exit /b
)
if "%opt%"=="9" (
    exit /b
)
echo Invalid choice.
pause
