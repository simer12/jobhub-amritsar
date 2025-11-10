# JobHub Amritsar - Automated Setup Script
# Run this script to set up the project quickly

Write-Host "🚀 JobHub Amritsar - Automated Setup" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "1️⃣ Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit
}

# Check MongoDB
Write-Host "`n2️⃣ Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version | Select-String "db version"
    Write-Host "✅ MongoDB found" -ForegroundColor Green
} catch {
    Write-Host "⚠️ MongoDB not found. Please install MongoDB from https://www.mongodb.com/download-center/community" -ForegroundColor Yellow
    Write-Host "   You can continue setup, but you'll need MongoDB to run the server." -ForegroundColor Yellow
}

# Create .env file if it doesn't exist
Write-Host "`n3️⃣ Setting up environment..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    if (Test-Path "env") {
        Copy-Item "env" ".env"
        Write-Host "✅ Created .env file from template" -ForegroundColor Green
    } else {
        Write-Host "⚠️ env template not found. Creating basic .env file..." -ForegroundColor Yellow
        @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobhub_amritsar
JWT_SECRET=jobhub_secret_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Created basic .env file" -ForegroundColor Green
    }
}

# Install dependencies
Write-Host "`n4️⃣ Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit
}

# Create upload directories
Write-Host "`n5️⃣ Creating upload directories..." -ForegroundColor Yellow
$directories = @(
    "uploads",
    "uploads\resumes",
    "uploads\profiles",
    "uploads\companies"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "✅ Created $dir" -ForegroundColor Green
    } else {
        Write-Host "✅ $dir already exists" -ForegroundColor Green
    }
}

# Ask if user wants to seed database
Write-Host "`n6️⃣ Database Setup" -ForegroundColor Yellow
$seed = Read-Host "Do you want to seed the database with sample Amritsar jobs? (Y/N)"
if ($seed -eq "Y" -or $seed -eq "y") {
    Write-Host "`n   Starting MongoDB..." -ForegroundColor Cyan
    Write-Host "   (Make sure MongoDB service is running)" -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    
    Write-Host "`n   Seeding database..." -ForegroundColor Cyan
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
        Write-Host "`n   📊 Seeded Data:" -ForegroundColor Cyan
        Write-Host "      - 5 Amritsar-based employers" -ForegroundColor White
        Write-Host "      - 2 sample job seekers" -ForegroundColor White
        Write-Host "      - 8 real Amritsar jobs" -ForegroundColor White
        Write-Host "`n   🔑 Test Login Credentials:" -ForegroundColor Cyan
        Write-Host "      Employer: rajesh@techAmr.com / password123" -ForegroundColor White
        Write-Host "      Job Seeker: manpreet@example.com / password123" -ForegroundColor White
    } else {
        Write-Host "⚠️ Failed to seed database. You may need to start MongoDB first." -ForegroundColor Yellow
        Write-Host "   Run 'npm run seed' manually after starting MongoDB." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️ Skipped database seeding" -ForegroundColor Yellow
}

# Setup complete
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Make sure MongoDB is running:" -ForegroundColor White
Write-Host "      mongod" -ForegroundColor Cyan
Write-Host "`n   2. Start the development server:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Cyan
Write-Host "`n   3. Open your browser:" -ForegroundColor White
Write-Host "      http://localhost:5000" -ForegroundColor Cyan

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Quick Start: QUICKSTART.md" -ForegroundColor White
Write-Host "   - Full Docs: README.md" -ForegroundColor White

Write-Host "`n🎉 Happy Coding!" -ForegroundColor Green
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
