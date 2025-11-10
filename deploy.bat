@echo off
echo ========================================
echo   JobHub Amritsar - Deployment Helper
echo ========================================
echo.

echo Choose deployment platform:
echo 1. Railway (Recommended - Easiest)
echo 2. Render (Free + PostgreSQL)
echo 3. Vercel (Static + API)
echo 4. Show deployment guide
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto guide
if "%choice%"=="5" goto end

:railway
echo.
echo ========================================
echo   Deploying to Railway
echo ========================================
echo.
echo Steps:
echo 1. Go to https://railway.app
echo 2. Click "Start a New Project"
echo 3. Select "Deploy from GitHub repo"
echo 4. Connect this repository
echo 5. Railway will auto-detect Node.js
echo 6. Add PostgreSQL database (optional)
echo 7. Your app will be live in 2 minutes!
echo.
echo Opening Railway...
start https://railway.app
goto end

:render
echo.
echo ========================================
echo   Deploying to Render
echo ========================================
echo.
echo Steps:
echo 1. Go to https://render.com
echo 2. Click "New +" then "Web Service"
echo 3. Connect your GitHub repository
echo 4. Configure:
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo 5. Add environment variables:
echo    - NODE_ENV=production
echo    - JWT_SECRET=your-secret-key
echo 6. Click "Create Web Service"
echo.
echo Opening Render...
start https://render.com
goto end

:vercel
echo.
echo ========================================
echo   Deploying to Vercel
echo ========================================
echo.
echo Installing Vercel CLI...
call npm i -g vercel
echo.
echo Deploying...
call vercel
echo.
echo For production deployment, run:
echo vercel --prod
echo.
goto end

:guide
echo.
echo Opening deployment guide...
start QUICK-DEPLOY.md
goto end

:end
echo.
echo ========================================
echo   Thank you for using JobHub!
echo ========================================
pause
