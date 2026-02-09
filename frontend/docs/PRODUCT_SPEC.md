# StemSplit - Product Specification

## Overview
StemSplit is an AI-powered audio separation web application that splits music into individual stems (vocals, drums, bass, other) using client-side processing.

## User Flow

### 1. Homepage (`/`)
- User sees hero section with product description
- User can drag & drop or click to upload an audio file (MP3, WAV, max 10MB)
- File preview shows name, size, and duration
- User clicks "Separate Audio" button to start processing

### 2. Processing Page (`/process`)
- Shows animated progress bar with percentage
- Displays which stem is currently being extracted
- Shows estimated time remaining
- User can cancel and return to homepage
- Auto-redirects to results when complete

### 3. Results Page (`/results`)
- Shows success message with original filename
- Displays 4 stem players:
  - Vocals (sky blue)
  - Drums (emerald green)
  - Bass (amber/orange)
  - Other (pink)
- Each player has:
  - Play/Pause button
  - Volume control with mute toggle
  - Seek bar with time display
  - Download button
- "Download All Stems" button for batch download
- "Process Another File" button to restart

## Test Scenarios

### Homepage Tests
1. Page loads with hero section visible
2. Upload area is clickable and accepts files
3. Invalid file types show error message
4. Files over 10MB show error message
5. Valid file shows preview with name and size
6. "Separate Audio" button navigates to /process

### Processing Page Tests
1. Page shows progress animation
2. Stem extraction messages update during processing
3. Cancel button returns to homepage
4. Page auto-redirects to /results when complete

### Results Page Tests
1. All 4 stem players are displayed
2. Play/Pause toggles work correctly
3. Volume slider adjusts audio level
4. Mute button works
5. Individual download buttons work
6. "Download All Stems" button works
7. "Process Another File" clears state and returns home

## Technical Notes
- All processing is simulated for MVP demo
- Audio files never leave the user's browser
- Responsive design works on mobile and desktop
