# Singscape AI Engine: Implementation Overview

Presented for review by the CTO and Engineering Leadership.

## Architecture
The Singscape separation engine is built as a **Decoupled AI Microservice** to ensure high performance, scalability, and hardware isolation.

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **AI Backend**: FastAPI (Asynchronous Python Service)
- **Deep Learning Component**: Meta's `htdemucs` (Hybrid Transformer)
- **Acceleration**: PyTorch with NVIDIA CUDA (Optimized for RTX 3050)

## Hardware Optimization (RTX 3050)
The backend is specifically tuned for consumer-grade GPUs with 4GB-8GB VRAM:
1.  **Memory Segments**: Processed in 12s chunks to prevent Out-Of-Memory (OOM) errors.
2.  **Float16 (FP16)**: Automatic mixed-precision for 2x speed increase on Turing/Ampere architectures.
3.  **Concurrency Locking**: A global thread lock prevents multiple AI separation tasks from fighting for GPU cores, ensuring stability under load.

## Setup Instructions
To run the AI engine:
1.  `cd backend/python`
2.  `pip install -r requirements.txt`
3.  `python main.py`

## Professional Quality
The default configuration is set to **Studio 2-Stem Mode**, producing 32-bit Float WAV files suitable for high-end mixing and vocal production.

---
*Configured for Zero-Cost self-hosted production.*
