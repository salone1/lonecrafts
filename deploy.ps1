#!/usr/bin/env pwsh
# Lone Crafts Deployment Script
# Automates: npm install, GitHub setup, Cloudflare deployment

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("install", "github", "cloudflare", "test", "all")]
    [string]$Step = "all"
)

$projectRoot = "c:\Users\Dell\lonecrafts"
$ErrorActionPreference = "Continue"

function Write-Header {
    Write-Host "`n`n========================================" -ForegroundColor Cyan
    Write-Host $args[0] -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    Write-Host "✅ $($args[0])" -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host "❌ $($args[0])" -ForegroundColor Red
}

function Write-Info {
    Write-Host "ℹ️  $($args[0])" -ForegroundColor Yellow
}

# Step 1: Install Dependencies
function Install-Dependencies {
    Write-Header "Step 1: Installing npm Dependencies"
    
    Write-Info "This may take 5-10 minutes on first install..."
    
    cd $projectRoot
    
    Write-Info "Clearing npm cache..."
    npm cache clean --force
    
    Write-Info "Installing root dependencies..."
    npm install --no-audit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed successfully"
        Write-Info "Installed packages in: root, packages/pages, packages/workers, packages/db"
    } else {
        Write-Error-Custom "npm install failed. Check the error above."
        return $false
    }
    
    return $true
}

# Step 2: GitHub Setup
function Setup-GitHub {
    Write-Header "Step 2: Setting Up GitHub Repository"
    
    Write-Info "Initializing git repository..."
    cd $projectRoot
    git init
    git add .
    git commit -m "Initial commit: Lone Crafts e-commerce system"
    git branch -M main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Git repository initialized"
        Write-Info "Remote repository not added yet (requires GitHub URL)"
        Write-Info "To push to GitHub:"
        Write-Info "  1. Create repository at https://github.com/new"
        Write-Info "  2. Run: git remote add origin https://github.com/yourusername/lonecrafts.git"
        Write-Info "  3. Run: git push -u origin main"
    } else {
        Write-Error-Custom "Git initialization failed"
        return $false
    }
    
    return $true
}

# Step 3: Cloudflare Setup
function Setup-Cloudflare {
    Write-Header "Step 3: Setting Up Cloudflare"
    
    Write-Info "Checking if Wrangler is installed..."
    $wrangler = npm list -g @cloudflare/wrangler 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Installing Wrangler CLI globally..."
        npm install -g wrangler
    } else {
        Write-Success "Wrangler already installed"
    }
    
    Write-Info "Follow these steps to complete Cloudflare setup:"
    Write-Info "1. Create free Cloudflare account: https://dash.cloudflare.com/sign-up"
    Write-Info "2. Create D1 Database:"
    Write-Info "   - Run: wrangler d1 create lonecrafts-db"
    Write-Info "   - Note the database_id from output"
    Write-Info "3. Create R2 Bucket:"
    Write-Info "   - Go to https://dash.cloudflare.com/?to=/:account/r2"
    Write-Info "   - Click 'Create bucket' and name it 'lonecrafts-images'"
    Write-Info "4. Update wrangler.toml files with your IDs"
    Write-Info "5. Set secrets:"
    Write-Info "   - wrangler secret put ADMIN_PASSWORD"
    Write-Info "   - wrangler secret put JWT_SECRET"
    Write-Info "   - wrangler secret put WHATSAPP_NUMBER"
    Write-Info "6. Deploy:"
    Write-Info "   - cd packages/workers && npm run deploy"
    Write-Info "   - cd ../pages && npm run build && (upload dist/ to Cloudflare Pages)"
    
    return $true
}

# Step 4: Run Local Tests
function Run-Tests {
    Write-Header "Step 4: Running Local Tests"
    
    Write-Info "Checking project structure..."
    
    $requiredDirs = @(
        "packages/pages/src",
        "packages/workers/src",
        "packages/db/migrations"
    )
    
    $allExist = $true
    foreach ($dir in $requiredDirs) {
        if (Test-Path "$projectRoot/$dir") {
            Write-Success "✓ $dir exists"
        } else {
            Write-Error-Custom "✗ $dir missing"
            $allExist = $false
        }
    }
    
    if (-not $allExist) {
        Write-Error-Custom "Some project directories are missing"
        return $false
    }
    
    Write-Info "Checking configuration files..."
    
    $requiredFiles = @(
        "packages/pages/vite.config.ts",
        "packages/workers/wrangler.toml",
        "packages/db/wrangler.toml",
        ".env.example"
    )
    
    foreach ($file in $requiredFiles) {
        if (Test-Path "$projectRoot/$file") {
            Write-Success "✓ $file found"
        } else {
            Write-Error-Custom "✗ $file missing"
            $allExist = $false
        }
    }
    
    if ($allExist) {
        Write-Success "All required files present"
        Write-Info "`nTo start development servers:"
        Write-Info "Terminal 1 (Workers API):"
        Write-Info "  cd $projectRoot\packages\workers"
        Write-Info "  npm run dev"
        Write-Info "`nTerminal 2 (React Frontend):"
        Write-Info "  cd $projectRoot\packages\pages"
        Write-Info "  npm run dev"
        Write-Info "`nThen open http://localhost:5173 in your browser"
    }
    
    return $allExist
}

# Main execution
Write-Host "
╔════════════════════════════════════════════╗
║   Lone Crafts - Deployment Script          ║
║   E-commerce & Business Management System  ║
╚════════════════════════════════════════════╝
" -ForegroundColor Magenta

if ($Step -eq "all" -or $Step -eq "install") {
    if (-not (Install-Dependencies)) { exit 1 }
}

if ($Step -eq "all" -or $Step -eq "github") {
    if (-not (Setup-GitHub)) { exit 1 }
}

if ($Step -eq "all" -or $Step -eq "cloudflare") {
    if (-not (Setup-Cloudflare)) { exit 1 }
}

if ($Step -eq "all" -or $Step -eq "test") {
    if (-not (Run-Tests)) { exit 1 }
}

Write-Header "Deployment Steps Complete!"
Write-Success "Your Lone Crafts project is ready"
Write-Info "Next: Run local dev servers and test in browser"
