# Use official Python 3.10 image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (especially ffmpeg for audio processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port (Railway will override this with the PORT env var)
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
