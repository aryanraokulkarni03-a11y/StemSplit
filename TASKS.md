## StemSplit Project Task List

This file tracks major engineering tasks, their status, and notes.  
Status legend: ✅ done · 🔄 in progress · ⏳ planned

---

### 1. Core Architecture & Deployment

- ✅ Frontend ↔ backend separation pipeline
  - Next.js app router → API routes → FastAPI `/separate` and `/status/{job_id}`
  - Uses `BACKEND_URL` env var for backend proxying
- ✅ Backend deployment
  - FastAPI on Railway via `backend/python/Dockerfile` and `railway.json`
  - Health endpoint `/health` with device info and startup warmup
- ✅ Frontend deployment
  - Next.js app on Vercel with environment variables wired (`BACKEND_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, etc.)
- ✅ GitHub CI
  - Lint, tests, build, security scan
  - CI build fixed for `/sign-in` by passing `NEXT_PUBLIC_APP_URL` from secrets

---

### 2. Audio Upload & Processing

- ✅ Move uploads off Vercel filesystem
  - New FastAPI endpoint `POST /upload` saves files under backend `UPLOAD_DIR`
  - Frontend upload now posts directly to `NEXT_PUBLIC_BACKEND_URL/upload`
  - `sessionStorage.audioFile` stores `{ name, inputPath, duration }`
- ✅ Separation uses backend paths
  - `/api/separate` accepts optional `inputPath` and forwards it to backend
  - Process page passes `inputPath` into `/api/separate`
- 🔄 TODO: Large-file experience
  - [ ] Confirm practical max file size that works reliably in Railway container (CPU + disk)
  - [ ] Surface max size and duration limits in the upload UI before user selects a file
  - [ ] Optionally trim or downsample very long tracks (server-side or pre-upload)

---

### 3. Job Management & Storage

- ✅ Persistent job metadata
  - Jobs tracked in-memory + JSON files under `JOB_STORE_DIR`
  - `/status/{job_id}` reads from disk if not in memory
- ✅ Background cleanup
  - Daily thread cleans up old job JSON files (default: older than 7 days)
- ⏳ Planned: DB-backed job store
  - [ ] Add `jobs` table (Postgres) with status, progress, input/output paths, user id, timestamps
  - [ ] Migrate `/separate` and `/status/{job_id}` to use DB as the source of truth

---

### 4. Rate Limiting, Auth & Security

- ✅ Rate limiting for separation
  - `POST /api/separate` uses `checkRateLimit` with `RateLimits.STRICT`
  - Frontend interprets `RATE_LIMITED` errors and shows friendly messages
- ✅ Auth hardening
  - Backend dev bypass (`dev_token_no_auth`) only active when `DEBUG=true`
  - Frontend refuses to call backend with empty Clerk token when Clerk is configured
- ✅ CORS configuration
  - Backend CORS based on `ALLOWED_ORIGINS`, with `["*"]` only in debug
- ⏳ Planned: Abuse protection & quotas
  - [ ] Simple per-IP and per-user quotas for separation jobs
  - [ ] Tiered limits (anonymous vs authenticated)

---

### 5. Observability & Error Handling

- ✅ Backend health & logging
  - `/health` reports engine status and device
  - Startup warmup logs device and catches engine init errors
  - Separation and upload endpoints log errors server-side
- ✅ Frontend error UX
  - Upload and separation start show detailed error messages (rate limit, backend failures)
  - Status polling surfaces 404/5xx with clear copy and allows retry
- ✅ Email best-effort behavior
  - Resend client is lazily initialized; if `RESEND_API_KEY` is missing, APIs log and skip sending instead of breaking builds
- ⏳ Planned: Centralized observability
  - [ ] Wire backend errors to Sentry or structured logs
  - [ ] Add basic metrics (job counts, durations, failures) for monitoring

---

### 6. UX & Documentation

- 🔄 TODO: UX polish
  - [ ] Update copy that still implies “processing happens in your browser” now that heavy lifting is on the backend
  - [ ] Add clear messaging around processing time and queueing when under load
  - [ ] Improve mobile layout for upload/process/results screens where needed
- ⏳ Planned: Developer docs
  - [ ] Root `README` with architecture diagram and local dev instructions
  - [ ] Short runbook: how to deploy, check `/health`, inspect logs, and handle common failures

