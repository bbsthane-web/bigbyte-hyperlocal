@echo off
title BigByte Systems - Podcast Video Importer
cls
echo ========================================================
echo  BigByte Systems: Talking Avatar Video Auto-Importer
echo ========================================================
echo.
echo Checking your Downloads folder for generated videos...
echo.
python sync_videos.py
echo.
pause
