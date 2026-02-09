# Singscape Unified Setup Script
# Run this to install all dependencies for both Frontend and AI Backend

# Fix encoding for emojis in PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================
# Configuration
# ============================================
$MIN_NODE_VERSION = 18
$MIN_PYTHON_VERSION = "3.11"
$SETUP_LOG = "setup_log.txt"

# ============================================
# Helper Functions
# ============================================

function Write-Status {
    param([string]$message, [string]$color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $logMessage = "[$timestamp] $message"
    Write-Host "  $message" -ForegroundColor $color
    Add-Content -Path $SETUP_LOG -Value $logMessage
}

function Write-Section {
    param([string]$title)
    Write-Host "`n$title" -ForegroundColor Cyan
    Write-Host ("=" * $title.Length) -ForegroundColor Cyan
    Add-Content -Path $SETUP_LOG -Value "`n=== $title ==="
}

function Test-MinVersion {
    param(
        [string]$current,
        [string]$minimum
    )
    
    try {
        $currentParts = $current.TrimStart('v').Split('.')
        $minimumParts = $minimum.Split('.')
        
        for ($i = 0; $i -lt $minimumParts.Length; $i++) {
            $currentNum = [int]$currentParts[$i]
            $minimumNum = [int]$minimumParts[$i]
            
            if ($currentNum -gt $minimumNum) { return $true }
            if ($currentNum -lt $minimumNum) { return $false }
        }
        return $true
    } catch {
        return $false
    }
}

# ============================================
# Start Setup
# ============================================

# Define root using script location
$root = Resolve-Path "$PSScriptRoot\.."
$SETUP_LOG_PATH = "$root\$SETUP_LOG"

# Clear previous log
if (Test-Path $SETUP_LOG_PATH) {
    Remove-Item $SETUP_LOG_PATH
}

Write-Section "🍂 Singscape: Environment Initialization"
Write-Status "Setup log: $SETUP_LOG" "Gray"

# ============================================
# Version Checks
# ============================================

Write-Section "🔍 Version Verification"

# Check Node.js
try {
    $nodeVersion = (node --version).TrimStart('v')
    $nodeMajor = [int]($nodeVersion.Split('.')[0])
    
    if ($nodeMajor -ge $MIN_NODE_VERSION) {
        Write-Status "✅ Node.js v$nodeVersion (minimum: v$MIN_NODE_VERSION)" "Green"
    } else {
        Write-Status "❌ Node.js v$nodeVersion is too old (minimum: v$MIN_NODE_VERSION)" "Red"
        Write-Status "   Download from: https://nodejs.org" "Yellow"
        exit 1
    }
} catch {
    Write-Status "❌ Node.js not found! Please install Node.js $MIN_NODE_VERSION+" "Red"
    Write-Status "   Download from: https://nodejs.org" "Yellow"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Status "✅ npm v$npmVersion" "Green"
} catch {
    Write-Status "❌ npm not found!" "Red"
    exit 1
}

# Check Python
try {
    $pythonVersionOutput = python --version 2>&1
    $pythonVersion = $pythonVersionOutput -replace "Python ", ""
    
    if (Test-MinVersion $pythonVersion $MIN_PYTHON_VERSION) {
        Write-Status "✅ Python $pythonVersion (minimum: $MIN_PYTHON_VERSION)" "Green"
    } else {
        Write-Status "❌ Python $pythonVersion is too old (minimum: $MIN_PYTHON_VERSION)" "Red"
        Write-Status "   Download from: https://python.org" "Yellow"
        exit 1
    }
} catch {
    Write-Status "❌ Python not found! Please install Python $MIN_PYTHON_VERSION+" "Red"
    Write-Status "   Download from: https://python.org" "Yellow"
    exit 1
}

# Check pip
try {
    $pipVersion = pip --version
    Write-Status "✅ pip installed" "Green"
} catch {
    Write-Status "❌ pip not found!" "Red"
    exit 1
}

# Check Git (optional but recommended)
try {
    $gitVersion = git --version
    Write-Status "✅ $gitVersion" "Green"
} catch {
    Write-Status "⚠️  Git not found (optional)" "Yellow"
}

# ============================================
# Environment Setup
# ============================================

Write-Section "📄 Environment Configuration"

$setupEnvScript = "$PSScriptRoot\setup-env.ps1"

if (Test-Path $setupEnvScript) {
    Write-Status "Environment setup script found" "Green"
    $runEnvSetup = Read-Host "  Do you want to configure environment files now? (Y/n)"
    
    if ($runEnvSetup -ne "n" -and $runEnvSetup -ne "N") {
        Write-Status "Running environment setup..." "Cyan"
        & $setupEnvScript
    } else {
        Write-Status "Skipping environment setup" "Yellow"
        Write-Status "You can run it later: .\scripts\setup-env.ps1" "Gray"
    }
} else {
    Write-Status "⚠️  Environment setup script not found" "Yellow"
    Write-Status "   Expected: $setupEnvScript" "Gray"
}

# ============================================
# Frontend Setup
# ============================================

Write-Section "📱 Frontend Dependencies (1/2)"

$frontendDir = "$root\frontend"
cd $frontendDir

if (-not (Test-Path "package.json")) {
    Write-Status "❌ package.json not found!" "Red"
    cd $PSScriptRoot
    exit 1
}

Write-Status "Installing Node.js packages..." "Yellow"
Write-Status "This may take a few minutes..." "Gray"

try {
    npm install 2>&1 | Tee-Object -Append -FilePath "$SETUP_LOG_PATH"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "✅ Frontend dependencies installed" "Green"
    } else {
        Write-Status "❌ npm install failed (exit code: $LASTEXITCODE)" "Red"
        cd $PSScriptRoot
        exit 1
    }
} catch {
    Write-Status "❌ Error during npm install: $_" "Red"
    cd $PSScriptRoot
    exit 1
}

# ============================================
# Backend Setup
# ============================================

Write-Section "🐍 Backend Dependencies (2/2)"

$backendDir = "$root\backend\python"
cd $backendDir

if (-not (Test-Path "requirements.txt")) {
    Write-Status "❌ requirements.txt not found!" "Red"
    cd $PSScriptRoot
    exit 1
}

# Ensure pip is up to date
Write-Status "Updating pip..." "Yellow"
python -m pip install --upgrade pip 2>&1 | Tee-Object -Append -FilePath "$SETUP_LOG_PATH"

# CUDA Installation for RTX 3050
Write-Status "Installing PyTorch with CUDA support..." "Yellow"
Write-Status "This prevents 'No GPU found' errors on RTX 3050" "Gray"

try {
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 --upgrade --force-reinstall 2>&1 | Tee-Object -Append -FilePath "$SETUP_LOG_PATH"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "✅ PyTorch with CUDA installed" "Green"
    } else {
        Write-Status "⚠️  PyTorch installation had warnings (exit code: $LASTEXITCODE)" "Yellow"
    }
} catch {
    Write-Status "⚠️  Error during PyTorch install: $_" "Yellow"
}

# Install remaining requirements
Write-Status "Installing Python packages (Demucs, FastAPI, etc.)..." "Yellow"

try {
    pip install -r requirements.txt 2>&1 | Tee-Object -Append -FilePath "$SETUP_LOG_PATH"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "✅ Backend dependencies installed" "Green"
    } else {
        Write-Status "❌ pip install failed (exit code: $LASTEXITCODE)" "Red"
        cd $PSScriptRoot
        exit 1
    }
} catch {
    Write-Status "❌ Error during pip install: $_" "Red"
    cd $PSScriptRoot
    exit 1
}

# Return to script root
cd $PSScriptRoot

# ============================================
# Verification
# ============================================

Write-Section "✅ Verification"

# Verify CUDA
Write-Status "Checking GPU acceleration..." "Yellow"

try {
    $cudaCheck = @"
import torch
if torch.cuda.is_available():
    print(f'✅ CUDA {torch.version.cuda}')
    print(f'✅ GPU: {torch.cuda.get_device_name(0)}')
else:
    print('⚠️  No CUDA GPU detected')
"@
    
    python -c $cudaCheck
} catch {
    Write-Status "⚠️  Could not verify CUDA" "Yellow"
}

# Verify Demucs
Write-Status "`nChecking Demucs installation..." "Yellow"

try {
    python -c "import demucs; print('✅ Demucs installed')"
} catch {
    Write-Status "❌ Demucs not found!" "Red"
}

# Verify FastAPI
Write-Status "Checking FastAPI installation..." "Yellow"

try {
    python -c "import fastapi; print('✅ FastAPI installed')"
} catch {
    Write-Status "❌ FastAPI not found!" "Red"
}

# ============================================
# Summary
# ============================================

Write-Section "✨ Setup Complete!"

Write-Host "`n  📦 Installed:" -ForegroundColor Cyan
Write-Status "  • Frontend: Node.js packages (Next.js, React, etc.)" "Green"
Write-Status "  • Backend: Python packages (PyTorch, Demucs, FastAPI)" "Green"

Write-Status "  📝 Setup log saved to: $SETUP_LOG" "Green"

Write-Host "`n  🚀 Next Steps:" -ForegroundColor Cyan
Write-Status "  1. Configure environment: .\scripts\setup-env.ps1 (if not done)" "White"
Write-Status "  2. Start application: .\scripts\run.ps1" "White"

Write-Host "`n  📚 Documentation:" -ForegroundColor Cyan
Write-Status "  • Project Home: .agent\PROJECT_HOME.md" "Gray"
Write-Status "  • Automation: AUTOMATION.md (coming soon)" "Gray"

Write-Host ""
