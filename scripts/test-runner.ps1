# Singscape Test Runner
# Wrapper script for TestSprite test execution and reporting

# Fix encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================
# Configuration
# ============================================
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$TEST_RESULTS_DIR = Join-Path $FRONTEND_DIR "testsprite_tests"
$REPORT_HTML = Join-Path $TEST_RESULTS_DIR "testsprite-mcp-test-report.html"
$REPORT_MD = Join-Path $TEST_RESULTS_DIR "testsprite-mcp-test-report.md"

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

function Test-ServiceRunning {
    param([string]$url)
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        return ($response.StatusCode -eq 200)
    } catch {
        return $false
    }
}

# ============================================
# Pre-flight Checks
# ============================================

Write-Section "🧪 Singscape Test Runner"

# Check if services are running
Write-Status "Checking services..." "Yellow"

$frontendRunning = Test-ServiceRunning "http://localhost:3000"
$backendRunning = Test-ServiceRunning "http://localhost:8000/health"

if (-not $frontendRunning) {
    Write-Status "❌ Frontend not running on port 3000" "Red"
    Write-Status "   Start with: .\run.ps1" "Yellow"
    exit 1
}

if (-not $backendRunning) {
    Write-Status "⚠️  Backend not running on port 8000" "Yellow"
    Write-Status "   Some tests may fail" "Gray"
}

Write-Status "✅ Frontend is running" "Green"
if ($backendRunning) {
    Write-Status "✅ Backend is running" "Green"
}

# ============================================
# Test Execution
# ============================================

Write-Section "🚀 Running Tests"

Write-Status "TestSprite tests should be executed via MCP tools" "Cyan"
Write-Status "Use the /test workflow for automated execution" "Gray"

Write-Host "`n  📋 Manual Playwright Tests:" -ForegroundColor Yellow
Write-Status "  cd frontend" "White"
Write-Status "  npx playwright test" "White"

# Check if Playwright is installed
cd $FRONTEND_DIR

if (Test-Path "node_modules\@playwright") {
    Write-Host "`n  ▶️  Run Playwright tests now? (Y/n): " -ForegroundColor Yellow -NoNewline
    $runTests = Read-Host
    
    if ($runTests -ne "n" -and $runTests -ne "N") {
        Write-Status "Running Playwright tests..." "Cyan"
        npx playwright test
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "✅ Tests passed!" "Green"
        } else {
            Write-Status "❌ Some tests failed" "Red"
        }
        
        # Show report
        Write-Host "`n  📊 View HTML report? (Y/n): " -ForegroundColor Yellow -NoNewline
        $showReport = Read-Host
        
        if ($showReport -ne "n" -and $showReport -ne "N") {
            npx playwright show-report
        }
    }
} else {
    Write-Status "⚠️  Playwright not installed" "Yellow"
    Write-Status "   Install with: npm install --save-dev @playwright/test" "Gray"
}

cd $PROJECT_ROOT

# ============================================
# Report Summary
# ============================================

Write-Section "📊 Test Reports"

if (Test-Path $REPORT_HTML) {
    Write-Status "✅ HTML Report: $REPORT_HTML" "Green"
    Write-Status "   Open in browser to view" "Gray"
}

if (Test-Path $REPORT_MD) {
    Write-Status "✅ Markdown Report: $REPORT_MD" "Green"
}

if (Test-Path $TEST_RESULTS_DIR) {
    $testFiles = Get-ChildItem -Path $TEST_RESULTS_DIR -Filter "*.json"
    if ($testFiles.Count -gt 0) {
        Write-Status "✅ Found $($testFiles.Count) test result files" "Green"
    }
}

# ============================================
# Summary
# ============================================

Write-Section "✨ Test Runner Complete"

Write-Host "`n  📚 Documentation:" -ForegroundColor Cyan
Write-Status "  • Test Workflow: .agent\workflows\test.md" "Gray"
Write-Status "  • Test PRD: docs\testsprite-prd.md" "Gray"

Write-Host "`n  🔧 Next Steps:" -ForegroundColor Cyan
Write-Status "  • Review test results" "White"
Write-Status "  • Fix any failing tests" "White"
Write-Status "  • Update PRD with completed checkpoints" "White"

Write-Host ""
