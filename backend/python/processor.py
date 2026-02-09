import sys
import os
import json
import subprocess
import time
import torch
from pathlib import Path

class AudioProcessor:
    def __init__(self, output_dir, stems=2):
        self.output_dir = output_dir
        self.stems = stems
        self.device = self._detect_device()
        self.model = "htdemucs" # High quality transformer

    def _detect_device(self):
        """Detect the best available hardware acceleration."""
        if torch.cuda.is_available():
            print("[Engine] CUDA detected! Using NVIDIA GPU acceleration.")
            return "cuda"
        elif torch.backends.mps.is_available():
            print("[Engine] MPS detected! Using Apple Silicon acceleration.")
            return "mps"
        print("[Engine] No GPU found. Falling back to CPU (Slow).")
        return "cpu"

    def process(self, input_file, callback=None):
        """
        Run Demucs with professional-grade settings for the RTX 3050.
        """
        try:
            # Handle Windows path normalization explicitly
            input_file = input_file.strip('"').strip("'")
            input_path = Path(input_file).resolve()
            
            print(f"[Engine] Processing request for: {input_path}")
            
            if not input_path.exists():
                # Debugging: List parent directory to see what's actually there
                parent = input_path.parent
                existing_files = os.listdir(parent) if parent.exists() else "DIR_MISSING"
                error_msg = f"Input file not found at: {input_path}. Directory {parent} contains: {existing_files}"
                print(f"[Engine] ERROR: {error_msg}")
                return {"status": "error", "message": error_msg}

            # Create output directory
            Path(self.output_dir).mkdir(parents=True, exist_ok=True)
            
            # Professional CLI params
            # --segment: controls memory usage (lower is better for 4GB-8GB VRAM)
            # --overlap: controls quality (0.25 is default, higher is better but slower)
            # --shifts: number of random shifts (1 is fast, higher is better)
            cmd = [
                sys.executable, "-m", "demucs",
                "--out", str(input_path.parent.parent / "separated"), # Relative to uploads
                "-n", self.model,
                "--device", self.device,
                "--segment", "10", # Slightly tighter for 4GB RTX 3050 stability
                "--shifts", "1", # Fast for demonstration purposes
                str(input_path)
            ]

            if self.stems == 2:
                cmd.extend(["--two-stems", "vocals"])

            # Start process
            start_time = time.time()
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )

            # Monitor progress
            while True:
                output = process.stderr.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    # Demucs prints progress like: 0%|          | 0/100 [00:00<?, ?it/s]
                    if "%" in output:
                        try:
                            # Simplified percent extraction
                            percent_str = output.split('%')[0].split()[-1]
                            percent = float(percent_str)
                            progress_data = {
                                "status": "processing", 
                                "progress": percent,
                                "raw": f"Separating Stems: {percent}%"
                            }
                            if callback:
                                callback(progress_data)
                        except:
                            pass
            
            return_code = process.poll()
            
            if return_code == 0:
                track_name = input_path.stem
                # Demucs creates: separated/htdemucs/track_name/vocals.wav
                model_output_dir = input_path.parent.parent / "separated" / self.model / track_name
                
                stems = {}
                if model_output_dir.exists():
                    # We need to return paths relative to the 'public' folder for Next.js
                    public_dir = input_path.parent.parent # This is 'public' directory
                    
                    for stem_file in model_output_dir.glob("*.wav"):
                        rel_path = os.path.relpath(stem_file, start=public_dir)
                        stems[stem_file.stem] = rel_path.replace("\\", "/")
                
                return {
                    "status": "complete",
                    "duration": time.time() - start_time,
                    "stems": stems
                }
            else:
                stderr_out = process.stderr.read()
                return {"status": "error", "message": f"Demucs failed with code {return_code}", "details": stderr_out}

        except Exception as e:
            return {"status": "error", "message": f"Processor error: {str(e)}"}
