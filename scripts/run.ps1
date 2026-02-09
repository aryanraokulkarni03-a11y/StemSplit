# Singscape Unified Runner
# Starts the FastAPI AI Engine and the Next.js Frontend simultaneously

# Fix encoding for emojis in PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================
# Configuration
# ============================================
$FRONTEND_PORT = 3000
$BACKEND_PORT = 8000
$HEALTH_CHECK_TIMEOUT = 30
$HEALTH_CHECK_INTERVAL = 2

# ============================================
# Helper Functions
# ============================================

function Write-Status {
    param([string]$message, [string]$color = "White")
    Write-Host "  $message" -ForegroundColor $color
}

function Write-Section {
    param([string]$title)
    Write-Host "`n$title" -ForegroundColor Cyan
    Write-Host ("=" * $title.Length) -ForegroundColor Cyan
}

function Test-Port {
    param([int]$port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("127.0.0.1", $port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

function Wait-ForService {
    param(
        [string]$url,
        [string]$name,
        [int]$timeout = 30
    )
    
    $elapsed = 0
    Write-Host "`n  ⏳ Waiting for $name to start..." -ForegroundColor Yellow -NoNewline
    
    while ($elapsed -lt $timeout) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host " ✅" -ForegroundColor Green
                return $true
            }
        } catch {
            # Service not ready yet
        }
        
        Start-Sleep -Seconds $HEALTH_CHECK_INTERVAL
        $elapsed += $HEALTH_CHECK_INTERVAL
        Write-Host "." -NoNewline -ForegroundColor Yellow
    }
    
    Write-Host " ❌" -ForegroundColor Red
    return $false
}

function Test-Command {
    param([string]$command)
    
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# ============================================
# Pre-flight Checks
# ============================================

Write-Section "🍂 Singscape: Pre-flight Checks"

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Status "✅ Node.js: $nodeVersion" "Green"
} else {
    Write-Status "❌ Node.js not found! Please install Node.js 18+" "Red"
    exit 1
}

# Check Python
if (Test-Command "python") {
    $pythonVersion = python --version
    Write-Status "✅ Python: $pythonVersion" "Green"
} else {
    Write-Status "❌ Python not found! Please install Python 3.11+" "Red"
    exit 1
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Status "✅ npm: v$npmVersion" "Green"
} else {
    Write-Status "❌ npm not found!" "Red"
    exit 1
}

# Check if ports are available
Write-Section "🔌 Port Availability Check"

if (Test-Port $FRONTEND_PORT) {
    Write-Status "⚠️  Port $FRONTEND_PORT is already in use!" "Yellow"
    $killFrontend = Read-Host "  Kill process on port $FRONTEND_PORT? (Y/n)"
    if ($killFrontend -ne "n" -and $killFrontend -ne "N") {
        $process = Get-NetTCPConnection -LocalPort $FRONTEND_PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Status "✅ Killed process on port $FRONTEND_PORT" "Green"
        }
    } else {
        Write-Status "❌ Cannot start frontend on occupied port" "Red"
        exit 1
    }
} else {
    Write-Status "✅ Port $FRONTEND_PORT is available" "Green"
}

if (Test-Port $BACKEND_PORT) {
    Write-Status "⚠️  Port $BACKEND_PORT is already in use!" "Yellow"
    $killBackend = Read-Host "  Kill process on port $BACKEND_PORT? (Y/n)"
    if ($killBackend -ne "n" -and $killBackend -ne "N") {
        $process = Get-NetTCPConnection -LocalPort $BACKEND_PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Status "✅ Killed process on port $BACKEND_PORT" "Green"
        }
    } else {
        Write-Status "❌ Cannot start backend on occupied port" "Red"
        exit 1
    }
} else {
    Write-Status "✅ Port $BACKEND_PORT is available" "Green"
}

# Check environment files
Write-Section "📄 Environment Configuration"

# Corrected paths relative to script location
$root = Resolve-Path "$PSScriptRoot\.."
$frontendEnv = "$root\frontend\.env.local"
$backendEnv = "$root\backend\python\.env"

if (Test-Path $frontendEnv) {
    Write-Status "✅ Frontend environment: $frontendEnv" "Green"
} else {
    Write-Status "⚠️  Frontend .env.local not found" "Yellow"
    Write-Status "   Using default configuration" "Gray"
}

if (Test-Path $backendEnv) {
    Write-Status "✅ Backend environment: $backendEnv" "Green"
} else {
    Write-Status "⚠️  Backend .env not found" "Yellow"
    Write-Status "   Using default configuration" "Gray"
}

# Check GPU availability
Write-Section "🎮 GPU Detection"

try {
    $pythonCheck = @"
import torch
if torch.cuda.is_available():
    print(f'CUDA {torch.version.cuda}')
    print(f'{torch.cuda.get_device_name(0)}')
else:
    print('CPU Only')
"@
    
    $gpuInfo = python -c $pythonCheck 2>$null
    if ($gpuInfo -match "CUDA") {
        Write-Status "✅ GPU Acceleration: $($gpuInfo -join ' | ')" "Green"
    } else {
        Write-Status "⚠️  No GPU detected - using CPU (slower)" "Yellow"
    }
} catch {
    Write-Status "⚠️  Could not detect GPU" "Yellow"
}

# ============================================
# Start Services
# ============================================

Write-Section "🚀 Starting Services"

# Ensure we are using absolute paths based on script location
$root = Resolve-Path "$PSScriptRoot\.."

# 1. Start AI Backend in a new window
Write-Status "[1/2] Launching AI Backend (FastAPI)..." "Yellow"
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend\python'; python main.py" -PassThru
Start-Sleep -Seconds 2

# 2. Start Frontend in a new window
Write-Status "[2/2] Launching Frontend (Next.js)..." "Yellow"
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev" -PassThru
Start-Sleep -Seconds 2

# ============================================
# Health Checks
# ============================================

Write-Section "🏥 Health Checks"

# Wait for backend
$backendHealthy = Wait-ForService -url "http://localhost:$BACKEND_PORT/health" -name "Backend API" -timeout $HEALTH_CHECK_TIMEOUT

# Wait for frontend
$frontendHealthy = Wait-ForService -url "http://localhost:$FRONTEND_PORT" -name "Frontend" -timeout $HEALTH_CHECK_TIMEOUT

# ============================================
# Summary
# ============================================

Write-Section "✨ Singscape is Running!"

if ($backendHealthy) {
    Write-Status "🐍 Backend API: http://localhost:$BACKEND_PORT" "Green"
    Write-Status "   API Docs: http://localhost:$BACKEND_PORT/docs" "Cyan"
} else {
    Write-Status "❌ Backend failed to start" "Red"
}

if ($frontendHealthy) {
    Write-Status "📱 Frontend: http://localhost:$FRONTEND_PORT" "Green"
} else {
    Write-Status "❌ Frontend failed to start" "Red"
}

# Open browser if both services are healthy
if ($backendHealthy -and $frontendHealthy) {
    Write-Host "`n  🌐 Opening browser..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:$FRONTEND_PORT"
}

Write-Host "`n  📝 Logs are in separate windows" -ForegroundColor Gray
Write-Host "  🛑 Press Ctrl+C in each window to stop services`n" -ForegroundColor Gray

# Keep script running to show status
Write-Host "  ℹ️  Press Enter to exit this status window..." -ForegroundColor Yellow
Read-Host
