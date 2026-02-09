# 🤖 Singscape Automation Guide

> **Complete automation suite for development, testing, and deployment**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Automation Workflows](#automation-workflows)
3. [Scripts Reference](#scripts-reference)
4. [Environment Management](#environment-management)
5. [Testing Suite](#testing-suite)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### First Time Setup

```powershell
# 1. Clone and navigate to project
cd c:\Users\HP\Documents\AI\Singscape

# 2. Run setup (installs all dependencies)
.\setup.ps1

# 3. Configure environment files
.\scripts\setup-env.ps1

# 4. Start the application
.\run.ps1
```

### Daily Development

```powershell
# Start both services with health checks
.\run.ps1

# Or use the workflow
/start
```

---

## 🔄 Automation Workflows

All workflows are located in `.agent/workflows/` and can be invoked with slash commands.

### `/start` - Automated Startup

**Purpose**: Start frontend and backend with comprehensive pre-flight checks

**What it does**:
- ✅ Verifies Node.js, Python, npm versions
- ✅ Checks port availability (3000, 8000)
- ✅ Detects GPU/CUDA support
- ✅ Validates environment files
- ✅ Starts both services in separate windows
- ✅ Polls health endpoints
- ✅ Opens browser when ready

**Usage**:
```powershell
.\run.ps1
```

**Reference**: [.agent/workflows/start.md](file:///c:/Users/HP/Documents/AI/Singscape/.agent/workflows/start.md)

---

### `/test` - TestSprite Testing

**Purpose**: Run comprehensive automated tests using TestSprite MCP

**What it does**:
- ✅ Bootstraps TestSprite for frontend testing
- ✅ Generates test plan from PRD (381 checkpoints)
- ✅ Executes all tests (P0, P1, P2)
- ✅ Generates HTML and Markdown reports
- ✅ Opens interactive test dashboard

**Usage**:
```powershell
# Via workflow
/test

# Or manual script
.\scripts\test-runner.ps1
```

**Reference**: [.agent/workflows/test.md](file:///c:/Users/HP/Documents/AI/Singscape/.agent/workflows/test.md)

---

### `/automate` - Full Automation

**Purpose**: Complete setup and startup automation

**What it does**:
- ✅ Runs setup.ps1 (if needed)
- ✅ Starts both services
- ✅ Verifies health endpoints

**Usage**:
```powershell
/automate
```

**Reference**: [.agent/workflows/automate.md](file:///c:/Users/HP/Documents/AI/Singscape/.agent/workflows/automate.md)

---

## 📜 Scripts Reference

All scripts are located in the project root or `scripts/` directory.

### `setup.ps1` - Dependency Installation

**Location**: `c:\Users\HP\Documents\AI\Singscape\setup.ps1`

**Purpose**: Install all frontend and backend dependencies

**Features**:
- Version verification (Node.js 18+, Python 3.11+)
- Environment file generation prompt
- CUDA/PyTorch installation for RTX 3050
- Demucs, FastAPI, Next.js installation
- Comprehensive verification
- Setup log generation

**Usage**:
```powershell
.\setup.ps1
```

**Output**: `setup_log.txt`

---

### `run.ps1` - Application Startup

**Location**: `c:\Users\HP\Documents\AI\Singscape\run.ps1`

**Purpose**: Start frontend and backend with health monitoring

**Features**:
- Pre-flight checks (versions, ports, GPU)
- Port conflict resolution
- Environment file validation
- Health endpoint polling
- Automatic browser launch
- Graceful error handling

**Usage**:
```powershell
.\run.ps1
```

**Services**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### `scripts/setup-env.ps1` - Environment Configuration

**Location**: `c:\Users\HP\Documents\AI\Singscape\scripts\setup-env.ps1`

**Purpose**: Interactive environment file generation

**Features**:
- Clerk key validation (pk_*, sk_* format)
- Backend URL configuration
- Feature flags setup
- GPU/CUDA configuration
- Secure key prompting
- Auto-generation of `.env.local` and `.env`

**Usage**:
```powershell
.\scripts\setup-env.ps1
```

**Creates**:
- `frontend/.env.local`
- `backend/python/.env`

---

### `scripts/test-runner.ps1` - Test Execution

**Location**: `c:\Users\HP\Documents\AI\Singscape\scripts\test-runner.ps1`

**Purpose**: Run Playwright tests and parse results

**Features**:
- Service availability check
- Playwright test execution
- Report generation
- Interactive test viewing

**Usage**:
```powershell
.\scripts\test-runner.ps1
```

---

## 🌐 Environment Management

### Environment Files

| File | Purpose | Location |
|------|---------|----------|
| `.env.local.example` | Frontend template | `frontend/.env.local.example` |
| `.env.local` | Frontend config (gitignored) | `frontend/.env.local` |
| `.env.example` | Backend template | `backend/python/.env.example` |
| `.env` | Backend config (gitignored) | `backend/python/.env` |

### Configuration Variables

#### Frontend (`frontend/.env.local`)

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MAX_FILE_SIZE=25

# UI/UX
NEXT_PUBLIC_THEME=dark
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

#### Backend (`backend/python/.env`)

```bash
# Clerk
CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_ISSUER=https://your-domain.clerk.accounts.dev

# GPU
CUDA_VISIBLE_DEVICES=0
PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:512

# Demucs
DEMUCS_MODEL=htdemucs
DEMUCS_SEGMENT=10
DEMUCS_SHIFTS=1

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

---

## 🧪 Testing Suite

### TestSprite Integration

**MCP Tools Available**:
1. `testsprite_bootstrap` - Initialize TestSprite
2. `testsprite_generate_frontend_test_plan` - Create test plan
3. `testsprite_generate_code_and_execute` - Run tests
4. `testsprite_open_test_result_dashboard` - View results

### Test Coverage

Based on [testsprite-prd.md](file:///c:/Users/HP/Documents/AI/Singscape/docs/testsprite-prd.md):

- **Total Checkpoints**: 381
- **P0 (Critical)**: 27 tests
- **P1 (High)**: 32 tests
- **P2 (Medium)**: 30+ tests

### Test Categories

| Category | Tests | Priority |
|----------|-------|----------|
| File Upload | TC-01 to TC-08 | P0 |
| Processing | TC-09 to TC-17 | P0 |
| Playback | TC-18 to TC-27 | P0 |
| UI/UX | UI-01 to UI-08 | P1 |
| Navigation | NAV-01 to NAV-06 | P1 |
| Performance | PERF-01 to PERF-10 | P2 |
| Accessibility | A11Y-01 to A11Y-10 | P2 |

---

## 🔧 Troubleshooting

### Port Already in Use

**Symptom**: Error starting services on port 3000 or 8000

**Solution**:
```powershell
# Kill all Node.js processes
taskkill /F /IM node.exe

# Kill all Python processes
taskkill /F /IM python.exe

# Or let run.ps1 handle it automatically
.\run.ps1
# (It will prompt to kill processes)
```

---

### Environment Files Missing

**Symptom**: Services start but authentication fails

**Solution**:
```powershell
# Run environment setup
.\scripts\setup-env.ps1

# Or manually copy templates
cp frontend\.env.local.example frontend\.env.local
cp backend\python\.env.example backend\python\.env
```

---

### GPU Not Detected

**Symptom**: "No CUDA GPU detected" warning

**Solution**:
1. Verify NVIDIA drivers installed
2. Check CUDA installation:
   ```powershell
   python -c "import torch; print(torch.cuda.is_available())"
   ```
3. Reinstall PyTorch with CUDA:
   ```powershell
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 --upgrade --force-reinstall
   ```

---

### Tests Fail to Run

**Symptom**: TestSprite or Playwright tests don't execute

**Solution**:
1. Ensure services are running:
   ```powershell
   curl http://localhost:3000
   curl http://localhost:8000/health
   ```
2. Install Playwright browsers:
   ```powershell
   cd frontend
   npx playwright install
   ```
3. Check TestSprite MCP connection

---

## 📚 Additional Resources

### Documentation

- **Project Home**: [.agent/PROJECT_HOME.md](file:///c:/Users/HP/Documents/AI/Singscape/.agent/PROJECT_HOME.md)
- **Backend README**: [backend/python/README_BACKEND.md](file:///c:/Users/HP/Documents/AI/Singscape/backend/python/README_BACKEND.md)
- **Main README**: [README1.md](file:///c:/Users/HP/Documents/AI/Singscape/README1.md)
- **Test PRD**: [docs/testsprite-prd.md](file:///c:/Users/HP/Documents/AI/Singscape/docs/testsprite-prd.md)

### Workflows

- `/brainstorm` - Structured brainstorming
- `/create` - Create new features
- `/debug` - Debug issues
- `/deploy` - Deployment workflow
- `/enhance` - Enhance existing features
- `/orchestrate` - Multi-agent coordination
- `/plan` - Project planning
- `/preview` - Preview server management
- `/status` - Project status
- `/ui-ux-pro-max` - UI/UX design

---

**Last Updated**: 2026-02-09  
**Version**: 1.0  
**Maintained By**: Antigravity AI
