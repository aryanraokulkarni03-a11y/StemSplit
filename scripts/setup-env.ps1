# Singscape Environment Setup Script
# Interactively creates .env files for frontend and backend

# Fix encoding for emojis
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "`n🔧 Singscape Environment Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Project root
$projectRoot = Split-Path -Parent $PSScriptRoot

# ============================================
# Helper Functions
# ============================================

function Test-ClerkKey {
    param([string]$key, [string]$prefix)
    
    if ($key -match "^$prefix`_[a-zA-Z0-9_]+$") {
        return $true
    }
    return $false
}

function Get-UserInput {
    param(
        [string]$prompt,
        [string]$default = "",
        [bool]$required = $false,
        [string]$validator = ""
    )
    
    $value = ""
    $isValid = $false
    
    while (-not $isValid) {
        if ($default) {
            $value = Read-Host "$prompt [$default]"
            if ([string]::IsNullOrWhiteSpace($value)) {
                $value = $default
            }
        } else {
            $value = Read-Host $prompt
        }
        
        # Check if required
        if ($required -and [string]::IsNullOrWhiteSpace($value)) {
            Write-Host "  ❌ This field is required!" -ForegroundColor Red
            continue
        }
        
        # Run validator if provided
        if ($validator -and -not [string]::IsNullOrWhiteSpace($value)) {
            switch ($validator) {
                "clerk_public" {
                    if (-not (Test-ClerkKey $value "pk")) {
                        Write-Host "  ❌ Invalid Clerk public key format (should start with pk_)" -ForegroundColor Red
                        continue
                    }
                }
                "clerk_secret" {
                    if (-not (Test-ClerkKey $value "sk")) {
                        Write-Host "  ❌ Invalid Clerk secret key format (should start with sk_)" -ForegroundColor Red
                        continue
                    }
                }
                "url" {
                    if ($value -notmatch "^https?://") {
                        Write-Host "  ❌ Invalid URL format (should start with http:// or https://)" -ForegroundColor Yellow
                    }
                }
                "number" {
                    if ($value -notmatch "^\d+$") {
                        Write-Host "  ❌ Must be a number" -ForegroundColor Red
                        continue
                    }
                }
            }
        }
        
        $isValid = $true
    }
    
    return $value
}

# ============================================
# Frontend Environment Setup
# ============================================

Write-Host "📱 Frontend Configuration (.env.local)" -ForegroundColor Yellow
Write-Host "--------------------------------------`n" -ForegroundColor Gray

$setupFrontend = Read-Host "Do you want to set up frontend environment? (Y/n)"
if ($setupFrontend -ne "n" -and $setupFrontend -ne "N") {
    
    Write-Host "`n🔐 Clerk Authentication" -ForegroundColor Cyan
    Write-Host "Get your keys from: https://dashboard.clerk.com`n" -ForegroundColor Gray
    
    $useAuth = Read-Host "Enable Clerk authentication? (Y/n)"
    
    if ($useAuth -ne "n" -and $useAuth -ne "N") {
        $clerkPublicKey = Get-UserInput -prompt "Clerk Publishable Key" -required $true -validator "clerk_public"
        $clerkSecretKey = Get-UserInput -prompt "Clerk Secret Key" -required $true -validator "clerk_secret"
        $enableAuth = "true"
    } else {
        $clerkPublicKey = "pk_test_placeholder"
        $clerkSecretKey = "sk_test_placeholder"
        $enableAuth = "false"
        Write-Host "  ℹ️  Auth disabled - using placeholder keys" -ForegroundColor Gray
    }
    
    Write-Host "`n🌐 Backend Configuration" -ForegroundColor Cyan
    $backendUrl = Get-UserInput -prompt "Backend URL" -default "http://localhost:8000" -validator "url"
    
    Write-Host "`n⚙️  Feature Flags" -ForegroundColor Cyan
    $debugMode = Get-UserInput -prompt "Enable debug mode? (true/false)" -default "true"
    $maxFileSize = Get-UserInput -prompt "Max file size (MB)" -default "25" -validator "number"
    
    # Create frontend .env.local
    $frontendEnvPath = Join-Path $projectRoot "frontend\.env.local"
    
    $frontendEnvContent = @"
# ============================================
# CLERK AUTHENTICATION
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$clerkPublicKey
CLERK_SECRET_KEY=$clerkSecretKey

# ============================================
# BACKEND API CONFIGURATION
# ============================================
NEXT_PUBLIC_BACKEND_URL=$backendUrl
NEXT_PUBLIC_API_TIMEOUT=30000

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_AUTH=$enableAuth
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=$debugMode

# ============================================
# FILE UPLOAD CONFIGURATION
# ============================================
NEXT_PUBLIC_MAX_FILE_SIZE=$maxFileSize
NEXT_PUBLIC_ALLOWED_TYPES=audio/mpeg,audio/wav,audio/mp3

# ============================================
# AUDIO PROCESSING
# ============================================
NEXT_PUBLIC_DEFAULT_STEMS=2
NEXT_PUBLIC_SHOW_GPU_STATUS=true

# ============================================
# UI/UX CONFIGURATION
# ============================================
NEXT_PUBLIC_THEME=dark
NEXT_PUBLIC_ENABLE_ANIMATIONS=true

# ============================================
# DEVELOPMENT ONLY
# ============================================
NEXT_PUBLIC_DEV_MODE=false

# Generated by setup-env.ps1 on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
    
    Set-Content -Path $frontendEnvPath -Value $frontendEnvContent -Encoding UTF8
    Write-Host "`n  ✅ Created: $frontendEnvPath" -ForegroundColor Green
}

# ============================================
# Backend Environment Setup
# ============================================

Write-Host "`n`n🐍 Backend Configuration (.env)" -ForegroundColor Yellow
Write-Host "--------------------------------------`n" -ForegroundColor Gray

$setupBackend = Read-Host "Do you want to set up backend environment? (Y/n)"
if ($setupBackend -ne "n" -and $setupBackend -ne "N") {
    
    Write-Host "`n🔐 Clerk Configuration (Backend)" -ForegroundColor Cyan
    
    if ($clerkPublicKey) {
        # Extract domain from public key for JWKS URL
        Write-Host "  ℹ️  Using Clerk keys from frontend setup" -ForegroundColor Gray
        $clerkDomain = Read-Host "Clerk domain (e.g., your-app.clerk.accounts.dev)"
        $clerkJwksUrl = "https://$clerkDomain/.well-known/jwks.json"
        $clerkIssuer = "https://$clerkDomain"
    } else {
        $clerkJwksUrl = "https://your-domain.clerk.accounts.dev/.well-known/jwks.json"
        $clerkIssuer = "https://your-domain.clerk.accounts.dev"
    }
    
    Write-Host "`n🎮 GPU Configuration" -ForegroundColor Cyan
    $cudaDevice = Get-UserInput -prompt "CUDA device (0 for GPU, -1 for CPU)" -default "0" -validator "number"
    
    Write-Host "`n🎵 Demucs Configuration" -ForegroundColor Cyan
    $demucsSegment = Get-UserInput -prompt "Segment size (10 for 4GB VRAM, 12 for 8GB)" -default "10" -validator "number"
    $demucsShifts = Get-UserInput -prompt "Quality shifts (1=fast, 5=best)" -default "1" -validator "number"
    
    # Create backend .env
    $backendEnvPath = Join-Path $projectRoot "backend\python\.env"
    
    $backendEnvContent = @"
# ============================================
# CLERK AUTHENTICATION
# ============================================
CLERK_JWKS_URL=$clerkJwksUrl
CLERK_ISSUER=$clerkIssuer

# ============================================
# CUDA/GPU CONFIGURATION
# ============================================
CUDA_VISIBLE_DEVICES=$cudaDevice
PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:512

# ============================================
# DEMUCS CONFIGURATION
# ============================================
DEMUCS_MODEL=htdemucs
DEMUCS_SEGMENT=$demucsSegment
DEMUCS_SHIFTS=$demucsShifts

# ============================================
# SERVER CONFIGURATION
# ============================================
HOST=0.0.0.0
PORT=8000
DEBUG=true

# ============================================
# CORS CONFIGURATION
# ============================================
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# ============================================
# FILE STORAGE
# ============================================
MAX_FILE_SIZE_MB=25
UPLOAD_DIR=./uploads
OUTPUT_DIR=./separated

# Generated by setup-env.ps1 on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
    
    Set-Content -Path $backendEnvPath -Value $backendEnvContent -Encoding UTF8
    Write-Host "`n  ✅ Created: $backendEnvPath" -ForegroundColor Green
}

# ============================================
# Summary
# ============================================

Write-Host "`n`n✨ Environment Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

if (Test-Path (Join-Path $projectRoot "frontend\.env.local")) {
    Write-Host "  📱 Frontend: frontend\.env.local" -ForegroundColor Cyan
}
if (Test-Path (Join-Path $projectRoot "backend\python\.env")) {
    Write-Host "  🐍 Backend: backend\python\.env" -ForegroundColor Cyan
}

Write-Host "`n⚠️  Security Reminder:" -ForegroundColor Yellow
Write-Host "  - Never commit .env files to git" -ForegroundColor Gray
Write-Host "  - Keep your Clerk keys secret" -ForegroundColor Gray
Write-Host "  - Use .env.example files for templates`n" -ForegroundColor Gray

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: .\setup.ps1 (install dependencies)" -ForegroundColor White
Write-Host "  2. Run: .\run.ps1 (start the application)`n" -ForegroundColor White
