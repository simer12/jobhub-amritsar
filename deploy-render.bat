@echo off
echo.
echo ========================================
echo   GitHub + Render Deployment Helper
echo ========================================
echo.
echo Step 1: Create GitHub Repository
echo ---------------------------------
echo 1. Go to: https://github.com/new
echo 2. Repository name: jobhub-amritsar
echo 3. Make it Public or Private
echo 4. DON'T initialize with README
echo 5. Click "Create repository"
echo 6. Copy the repository URL
echo.
echo Step 2: Add Remote and Push
echo ---------------------------------
set /p REPO_URL="Paste your GitHub repository URL: "
echo.
echo Adding remote...
git remote add origin %REPO_URL%
echo.
echo Pushing to GitHub...
git push -u origin master
echo.
echo ========================================
echo   SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Step 3: Deploy on Render
echo ---------------------------------
echo 1. Go to: https://render.com
echo 2. Sign up with GitHub (FREE, no credit card)
echo 3. Click "New +" then "Web Service"
echo 4. Connect your GitHub repository: jobhub-amritsar
echo 5. Configure:
echo    - Name: jobhub-amritsar
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo    - Plan: FREE
echo.
echo 6. Add Environment Variables:
echo    NODE_ENV=production
echo    JWT_SECRET=jobhub-render-secret-2025
echo    JWT_EXPIRE=30d
echo    PORT=10000
echo.
echo 7. Click "Create Web Service"
echo.
echo 8. After deployment, run in Render Shell:
echo    node createAdmin.js
echo    node seedData.js
echo.
echo ========================================
echo Your app will be live at:
echo https://jobhub-amritsar.onrender.com
echo ========================================
echo.
pause
