@echo off
echo ========================================
echo   Railway Deployment - JobHub Amritsar
echo ========================================
echo.

echo Step 1: Installing Railway CLI...
call npm install -g @railway/cli
echo.

echo Step 2: Login to Railway...
call railway login
echo.

echo Step 3: Initialize Project...
call railway init
echo.

echo Step 4: Link to Railway Project...
echo Please create a project on Railway.app first, then run:
echo railway link
echo.

echo Step 5: Deploy!
echo After linking, run: railway up
echo.

echo ========================================
echo Alternative: Manual Deployment
echo ========================================
echo 1. Go to https://railway.app
echo 2. Click "New Project"
echo 3. Select "Deploy from GitHub repo"
echo 4. Or upload this folder directly
echo ========================================
echo.

pause
