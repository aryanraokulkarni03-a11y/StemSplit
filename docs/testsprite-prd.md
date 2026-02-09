# Singscape - Product Requirements Document (PRD)
## For TestSprite Automated Testing

---

## 1. Product Overview

**Product Name:** Singscape (StemSplit)  
**Version:** 1.0 MVP  
**Type:** Web Application (Frontend + Backend Integration)  
**Primary Function:** AI-powered audio stem separation using Demucs  
**Target URL:** `http://localhost:3000`

### Core Value Proposition
Extract vocals, drums, bass, and instruments from any audio file using state-of-the-art AI for music practice, remixing, and learning.

---

## 2. Technical Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4 (CSS-first architecture)
- **Language:** TypeScript
- **Optimization:** Code splitting with `next/dynamic`

### Backend
- **API Routes:** Next.js API (Node.js runtime)
- **Processing Engine:** Python (Demucs htdemucs model)
- **Communication:** Child process spawning with JSON streaming

### Design System
- **Theme:** Brutalist Red/Black
- **Primary Color:** `#e50914` (Spotify Red)
- **Background:** `#000000` (Pure Black)
- **Typography:** Outfit font family
- **Style:** Hard shadows, zero border-radius, high contrast

---

## 3. Core Features & User Flows

### 3.1 File Upload Flow
**Route:** `/` (Homepage)

#### User Story
As a user, I want to upload an audio file so that I can separate it into individual stems.

#### Acceptance Criteria
1. ✅ User can drag & drop MP3/WAV files
2. ✅ User can click to browse and select files
3. ✅ File validation (max 25MB, MP3/WAV only)
4. ✅ File metadata display (name, size, duration)
5. ✅ Error handling for invalid files

#### Test Checkpoints
- [ ] **TC-01:** Drag and drop a valid MP3 file (< 25MB)
- [ ] **TC-02:** Click upload button and select valid WAV file
- [ ] **TC-03:** Attempt to upload file > 25MB (expect error)
- [ ] **TC-04:** Attempt to upload invalid format (e.g., .txt, .pdf) (expect error)
- [ ] **TC-05:** Verify file duration is accurately displayed
- [ ] **TC-06:** Verify "File Locked & Loaded" message appears
- [ ] **TC-07:** Click X button to remove selected file
- [ ] **TC-08:** Upload animation displays "DROP IT" on drag

### 3.2 Processing Flow
**Route:** `/process`

#### User Story
As a user, I want to see real-time progress while my audio is being processed.

#### Acceptance Criteria
1. ✅ Progress bar shows separation status
2. ✅ Individual stem status (Vocals, Drums, Bass, Other)
3. ✅ Visual feedback for each processing stage
4. ✅ Estimated time display
5. ✅ Error recovery ("Try Again" functionality)

#### Test Checkpoints
- [ ] **TC-09:** Click "Start Processing" from homepage
- [ ] **TC-10:** Verify redirect to `/process`
- [ ] **TC-11:** Verify all 4 stems show "Pending" status initially
- [ ] **TC-12:** Monitor progress bar advancement (0% → 100%)
- [ ] **TC-13:** Verify stems transition to "Processing" state
- [ ] **TC-14:** Verify stems transition to "Complete" state
- [ ] **TC-15:** Verify estimated time countdown
- [ ] **TC-16:** Force error scenario (invalid file) → verify "Try Again" button
- [ ] **TC-17:** Click "Try Again" → verify reset to upload page

### 3.3 Results & Playback Flow
**Route:** `/results`

#### User Story
As a user, I want to preview and download individual stems after separation.

#### Acceptance Criteria
1. ✅ Display 4 stem players (Vocals, Drums, Bass, Other)
2. ✅ Each player has play/pause control
3. ✅ Volume slider for each stem
4. ✅ Waveform visualization
5. ✅ Individual download button per stem
6. ✅ "Download All" button
7. ✅ "Process Another File" button

#### Test Checkpoints
- [ ] **TC-18:** Verify 4 stem cards are displayed
- [ ] **TC-19:** Click Play on Vocals stem → verify audio plays
- [ ] **TC-20:** Click Pause on Vocals stem → verify audio pauses
- [ ] **TC-21:** Adjust volume slider → verify volume changes
- [ ] **TC-22:** Click waveform → verify seek functionality
- [ ] **TC-23:** Click individual Download icon → verify file download
- [ ] **TC-24:** Click "DOWNLOAD ALL STEMS" → verify 4 sequential downloads
- [ ] **TC-25:** Verify download button shows "Downloading Stems..." state
- [ ] **TC-26:** Click "Process Another File" → verify redirect to homepage
- [ ] **TC-27:** Click "Back to Home" → verify redirect to homepage

---

## 4. UI/UX Design Requirements

### 4.1 Visual Design Checkpoints
- [ ] **UI-01:** Pure black background (`#000000`) across all pages
- [ ] **UI-02:** Primary interactive elements use `#e50914` (Spotify Red)
- [ ] **UI-03:** All cards have hard shadows (`4px 4px 0px`)
- [ ] **UI-04:** Zero border-radius (sharp corners)
- [ ] **UI-05:** Outfit font family is loaded and applied
- [ ] **UI-06:** Brutalist card style on FileUpload component
- [ ] **UI-07:** Vinyl spin animation visible on selected file preview
- [ ] **UI-08:** Hover effects trigger shadow/color changes

### 4.2 Responsive Design Checkpoints
- [ ] **RD-01:** Test on desktop (1920x1080)
- [ ] **RD-02:** Test on tablet (768x1024)
- [ ] **RD-03:** Test on mobile (375x667)
- [ ] **RD-04:** Verify grid layout adapts (2-column → 1-column)
- [ ] **RD-05:** Verify navigation menu works on mobile
- [ ] **RD-06:** Verify file upload area is touch-friendly

---

## 5. Performance Requirements

### 5.1 Bundle Size
- [ ] **PERF-01:** Initial page load < 1MB (gzipped)
- [ ] **PERF-02:** Lazy-loaded chunks for heavy components verified
- [ ] **PERF-03:** `FileUpload` loaded only when visible
- [ ] **PERF-04:** `StemPlayer` loaded only on results page
- [ ] **PERF-05:** `WaveformVisualizer` loaded dynamically

### 5.2 Runtime Performance
- [ ] **PERF-06:** Time to Interactive (TTI) < 3 seconds
- [ ] **PERF-07:** First Contentful Paint (FCP) < 1.5 seconds
- [ ] **PERF-08:** Audio playback latency < 100ms
- [ ] **PERF-09:** No frame drops during waveform rendering
- [ ] **PERF-10:** Smooth scroll on all pages (60fps)

---

## 6. Accessibility Requirements

### 6.1 Keyboard Navigation
- [ ] **A11Y-01:** Tab through all interactive elements
- [ ] **A11Y-02:** Enter/Space activates buttons
- [ ] **A11Y-03:** Arrow keys control volume sliders
- [ ] **A11Y-04:** Escape closes modals/dropdowns

### 6.2 Screen Reader Support
- [ ] **A11Y-05:** All images have `alt` attributes
- [ ] **A11Y-06:** ARIA labels on icon-only buttons
- [ ] **A11Y-07:** Status updates announced (e.g., "Processing...")
- [ ] **A11Y-08:** Form validation errors announced

### 6.3 Color Contrast
- [ ] **A11Y-09:** Text on black background meets WCAG AA (4.5:1)
- [ ] **A11Y-10:** Red primary color has sufficient contrast

---

## 7. Edge Cases & Error Handling

### 7.1 File Upload Edge Cases
- [ ] **EDGE-01:** Upload during processing (should be disabled)
- [ ] **EDGE-02:** Upload file with special characters in name
- [ ] **EDGE-03:** Upload corrupted audio file (expect error)
- [ ] **EDGE-04:** Upload extremely short audio (< 5 seconds)
- [ ] **EDGE-05:** Upload extremely long audio (> 10 minutes)
- [ ] **EDGE-06:** Cancel upload mid-selection

### 7.2 Processing Edge Cases
- [ ] **EDGE-07:** Close browser tab during processing
- [ ] **EDGE-08:** Refresh page during processing
- [ ] **EDGE-09:** Network disconnection during processing
- [ ] **EDGE-10:** Backend timeout (Python process fails)
- [ ] **EDGE-11:** Out of memory error (large file)

### 7.3 Playback Edge Cases
- [ ] **EDGE-12:** Play multiple stems simultaneously
- [ ] **EDGE-13:** Seek to end of waveform
- [ ] **EDGE-14:** Adjust volume during playback
- [ ] **EDGE-15:** Download while playing
- [ ] **EDGE-16:** Browser audio policy blocks autoplay

---

## 8. Navigation & Routing

### 8.1 Route Structure
| Route | Purpose | Entry Points |
|-------|---------|--------------|
| `/` | Homepage + Upload | Direct URL, Header logo |
| `/process` | Processing screen | "Start Processing" button |
| `/results` | Playback + Download | Auto-redirect after processing |

### 8.2 Navigation Checkpoints
- [ ] **NAV-01:** Click header logo → navigate to `/`
- [ ] **NAV-02:** Click "Features" → scroll to features section
- [ ] **NAV-03:** Click "Start Splitting" → scroll to upload
- [ ] **NAV-04:** Click "Get Started Free" → scroll to upload
- [ ] **NAV-05:** Browser back button works correctly
- [ ] **NAV-06:** Deep link to `/results` without data → redirect to `/`

---

## 9. Data Flow & State Management

### 9.1 Session Storage
- [ ] **DATA-01:** File metadata stored in sessionStorage
- [ ] **DATA-02:** Processing results stored in sessionStorage
- [ ] **DATA-03:** sessionStorage cleared on "Process Another"
- [ ] **DATA-04:** sessionStorage persists on page refresh

### 9.2 Blob URLs
- [ ] **DATA-05:** Blob URLs generated for audio playback
- [ ] **DATA-06:** Blob URLs revoked on navigation
- [ ] **DATA-07:** No memory leaks from unreleased blobs

---

## 10. Backend Integration

### 10.1 API Endpoints
#### `POST /api/upload`
- [ ] **API-01:** Accepts multipart/form-data
- [ ] **API-02:** Validates file size
- [ ] **API-03:** Returns jobId and file metadata
- [ ] **API-04:** Returns 400 for invalid files
- [ ] **API-05:** Returns 500 for server errors

#### `POST /api/separate`
- [ ] **API-06:** Spawns Python child process
- [ ] **API-07:** Returns job status
- [ ] **API-08:** Handles process errors gracefully
- [ ] **API-09:** Cleans up temporary files

#### `GET /api/health`
- [ ] **API-10:** Returns 200 OK when services are running
- [ ] **API-11:** Returns service status JSON

### 10.2 Python Backend
- [ ] **PY-01:** `processor.py` executes successfully
- [ ] **PY-02:** Demucs model downloads on first run
- [ ] **PY-03:** Progress JSON streamed to stdout
- [ ] **PY-04:** Output WAV files created in correct directory
- [ ] **PY-05:** Graceful failure on insufficient memory

---

## 11. Critical User Journeys

### Journey 1: Happy Path
1. User lands on homepage
2. Drags MP3 file to upload zone
3. File details display correctly
4. Clicks "Start Processing"
5. Sees progress bar advance
6. Redirected to results page
7. Plays Vocals stem
8. Downloads all stems
9. Processes another file

**Checkpoint:** All steps complete without errors

### Journey 2: Error Recovery
1. User uploads invalid file
2. Sees error message
3. Uploads valid file
4. Processing fails (mock error)
5. Clicks "Try Again"
6. Successfully processes on retry

**Checkpoint:** Error handling and retry mechanism work

### Journey 3: Multi-Stem Management
1. User completes processing
2. Plays Vocals stem
3. Plays Drums stem (Vocals auto-pauses)
4. Adjusts volumes independently
5. Downloads individual stems
6. Downloads all stems

**Checkpoint:** Audio management and downloads work correctly

---

## 12. Browser Compatibility

- [ ] **COMPAT-01:** Chrome 120+ (primary)
- [ ] **COMPAT-02:** Firefox 120+
- [ ] **COMPAT-03:** Safari 17+
- [ ] **COMPAT-04:** Edge 120+

---

## 13. Test Priorities

### P0 (Critical - Must Pass)
- File upload (TC-01, TC-02)
- Processing flow (TC-09 to TC-15)
- Audio playback (TC-19, TC-20)
- Download functionality (TC-23, TC-24)

### P1 (High - Should Pass)
- File validation (TC-03, TC-04)
- Navigation (NAV-01 to NAV-06)
- UI design (UI-01 to UI-08)
- Error handling (EDGE-03, EDGE-07)

### P2 (Medium - Nice to Have)
- Accessibility (A11Y-01 to A11Y-10)
- Performance (PERF-01 to PERF-10)
- Edge cases (EDGE-01 to EDGE-16)

---

## 14. Known Limitations

1. **Browser Tools:** Automated screenshots may fail due to `$HOME` env variable on Windows
2. **Python Backend:** Requires manual installation of dependencies (`pip install -r requirements.txt`)
3. **Processing:** Currently mock data; real Demucs integration pending Python env setup
4. **File Storage:** Files stored in memory (sessionStorage); no server-side persistence

---

## 15. Success Criteria

### Definition of Done
- [ ] All P0 tests pass (100%)
- [ ] All P1 tests pass (≥ 90%)
- [ ] All P2 tests pass (≥ 70%)
- [ ] Zero critical bugs
- [ ] Build completes without errors
- [ ] Lighthouse score ≥ 85

---

## 16. Test Execution Notes

### Prerequisites
1. Server running: `npm start` in `frontend/` directory
2. Port: `3000`
3. Base URL: `http://localhost:3000`

### Test Data
- **Valid MP3:** Any MP3 file < 25MB
- **Valid WAV:** Any WAV file < 25MB
- **Invalid File:** `.txt`, `.pdf`, `.jpg` files
- **Large File:** File > 25MB

### Environment
- OS: Windows 11
- Node.js: 18+
- Browser: Chrome 120+

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-08  
**Author:** Antigravity AI  
**For:** TestSprite Automated Testing
