# Singscape (StemSplit)

AI-powered audio stem separation web application that uses Meta's Demucs model to split audio files into individual components (vocals, drums, bass, other instruments).

## 🎵 Features

- **AI-Powered Separation**: Uses state-of-the-art Demucs htdemucs model for professional-grade stem separation
- **Real-time Processing**: Background job processing with progress tracking and queue management
- **GPU Optimized**: Accelerated processing with CUDA support for NVIDIA GPUs (RTX 3050 optimized)
- **Secure & Private**: Enterprise-grade encryption with automatic file cleanup (7 days)
- **Rate Limited**: Built-in abuse protection with user quotas
- **Responsive Design**: Mobile-friendly skeuomorphic interface inspired by vintage audio equipment
- **Backend Architecture**: Decoupled frontend/backend with scalable API design

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Engine     │
│   (Next.js)     │    │   (FastAPI)     │    │   (Demucs)      │
│                 │    │                 │    │                 │
│ • Upload UI     │◄──►│ • File Upload   │◄──►│ • PyTorch       │
│ • Processing    │    │ • Job Queue    │    │ • CUDA          │
│ • Results       │    │ • Rate Limits   │    │ • Audio Processing│
│ • Auth (Clerk) │    │ • Database      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │    Railway      │    │   GPU/Cloud     │
│   Deployment    │    │   Deployment    │    │   Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 16.1.6 with App Router (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom brutalist design system
- **Authentication**: Clerk (optional, development bypass available)
- **State Management**: React hooks + sessionStorage
- **Audio Processing**: Tone.js, WaveSurfer.js, Web Audio API
- **UI Components**: Radix UI, Lucide React icons
- **Testing**: Playwright, Testing Library

#### Backend
- **API Layer**: Next.js API routes (Node.js runtime) + FastAPI (Python)
- **Deep Learning**: PyTorch with CUDA acceleration
- **AI Model**: Meta's htdemucs (Hybrid Transformer)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy with repository pattern
- **Authentication**: JWT verification with Clerk integration
- **Rate Limiting**: User quotas and abuse protection

#### Deployment
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Railway (Python FastAPI Docker container)
- **Database**: Railway PostgreSQL (production) / SQLite (development)
- **CI/CD**: GitHub Actions with automated testing

### Data Flow

1. **Upload**: User uploads audio file → FastAPI backend → File storage
2. **Processing**: Job queued → Demucs AI processing → Stem generation
3. **Results**: Processed stems stored → Frontend retrieves → User downloads

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git
- Optional: NVIDIA GPU with CUDA for faster processing

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Singscape
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

3. **Backend Setup**
   ```bash
   cd backend/python
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python main.py
   ```
   The backend will be available at `http://localhost:8000`

4. **Environment Configuration**

   Create `.env` files in both frontend and backend directories:

   **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

   **Backend (.env)**:
   ```env
   DEBUG=true
   MAX_FILE_SIZE_MB=25
   DATABASE_URL=sqlite:///./singscape.db
   ALLOWED_ORIGINS=http://localhost:3000
   ```

### Automated Setup (PowerShell)

For Windows users, run the automated setup script:

```powershell
.\scripts\setup.ps1
```

This will:
- Install frontend dependencies
- Set up Python environment
- Configure environment files
- Start both frontend and backend

## 🎛️ Key Components

### File Upload System
- **Frontend**: Drag-and-drop interface with real-time validation
- **Backend**: File size limits, type checking, secure storage
- **Features**: Progress tracking, error handling, mobile support

### AI Processing Engine
- **Model**: Meta's htdemucs (Hybrid Transformer)
- **Hardware**: CUDA acceleration with consumer GPU optimization
- **Memory**: Segmented processing for VRAM constraints
- **Performance**: Mixed precision processing (2x speed improvement)

### Job Management
- **Queue**: Background processing with position tracking
- **Persistence**: Database-backed job storage
- **Monitoring**: Real-time progress and status updates
- **Cleanup**: Automatic file deletion after 7 days

### Rate Limiting & Security
- **Quotas**: Per-user limits (5 jobs/hour, 20 jobs/day)
- **Authentication**: JWT-based with Clerk integration
- **Validation**: File type and size verification
- **CORS**: Environment-based origin control

## 📱 User Interface

The application features a skeuomorphic design inspired by vintage audio equipment:

- **Tape Deck Upload**: Drag-and-drop interface with cassette tape visualization
- **Processing Console**: Rack-mounted UI with VU meters and status indicators
- **Mixing Desk**: Professional audio console interface for results
- **Mobile Responsive**: Optimized for all screen sizes

## 🗄️ Database Schema

### Jobs Table
```sql
- id (string, primary key)
- status (string): queued, processing, completed, error
- progress (integer): 0-100
- input_path (string): Source audio file path
- output_dir (string): Processed stems directory
- stems (integer): Number of stems to separate
- user_id (string): Clerk user ID or "anonymous"
- created_at/updated_at (timestamps)
- processing_duration (float): Processing time in seconds
- stem_files (json): Generated stem file paths
```

### User Quotas
```sql
- user_id (string, unique)
- jobs_per_hour (integer): Default 5
- jobs_per_day (integer): Default 20
- max_file_size_mb (integer): Default 25
- current_usage counters
```

### Job Metrics
```sql
- job_id (string)
- file_size_mb (float)
- processing_time_seconds (float)
- success (boolean)
- error_type (string)
- gpu_used (boolean)
```

## 🔧 Configuration

### Environment Variables

#### Backend
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# File handling
MAX_FILE_SIZE_MB=25
UPLOAD_DIR=./uploads
OUTPUT_DIR=./separated

# AI Model
DEMUCS_MODEL=htdemucs
DEMUCS_SEGMENT=5  # Memory optimization
CUDA_VISIBLE_DEVICES=0  # GPU selection

# Security
CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test        # Playwright end-to-end tests
npm run test:unit   # Jest unit tests
```

### Backend Tests
```bash
cd backend/python
python -m pytest    # Python tests
```

## 📊 Monitoring & Observability

### Health Checks
- Frontend: `GET /api/health`
- Backend: `GET /health`
- Database: Connection status in health endpoint

### Logging
- Structured logging with request IDs
- Error tracking and user activity logs
- Performance metrics collection

### Metrics Available
- Job counts and success rates
- Processing times and queue wait times
- User quota utilization
- File processing statistics

## 🚀 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect repository to Railway
2. Set `DATABASE_URL` for PostgreSQL
3. Configure environment variables
4. Deploy via Docker container

### Database Migration
```bash
# Production database initialization handled automatically
# Tables are created on first startup
```

## 🔒 Security Considerations

- **File Validation**: Type and size checking before processing
- **Authentication**: JWT token verification with Clerk
- **Rate Limiting**: User quotas to prevent abuse
- **CORS**: Environment-based origin control
- **Cleanup**: Automatic file deletion after 7 days
- **Encryption**: HTTPS everywhere with secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Meta AI** for the Demucs stem separation model
- **Clerk** for authentication services
- **Vercel** and **Railway** for hosting platform
- The open-source community for the amazing tools and libraries

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section below
- Review the deployment runbook for common issues

---

### Troubleshooting

**Common Issues:**

1. **"Model loading failed"** → Check CUDA availability and PyTorch installation
2. **"File too large"** → Check MAX_FILE_SIZE_MB configuration
3. **"Database connection failed"** → Verify DATABASE_URL environment variable
4. **"CORS errors"** → Update ALLOWED_ORIGINS in backend configuration

**Debug Mode:**
Set `DEBUG=true` in backend .env for detailed logging and development bypasses.

**Performance Optimization:**
- Use GPU for faster processing (CUDA_VISIBLE_DEVICES=0)
- Adjust DEMUCS_SEGMENT based on available VRAM
- Monitor queue times and scale resources accordingly