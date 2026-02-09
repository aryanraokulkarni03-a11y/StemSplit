import sys
import os
import subprocess
import json
import argparse
import time

def write_status(output_dir, status, progress=0, message="", data=None, error=None):
    """Writes a status.json file for the frontend to poll."""
    status_file = os.path.join(output_dir, "status.json")
    content = {
        "status": status,
        "progress": progress,
        "message": message,
        "updatedAt": time.time()
    }
    if data:
        content.update(data)
    if error:
        content["error"] = error
        
    with open(status_file, "w") as f:
        json.dump(content, f)

def separate_audio(input_file, output_dir):
    """
    Wraps the Demucs CLI to separate audio.
    """
    try:
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # 1. Write START status
        write_status(output_dir, "processing", 10, "Initializing Demucs engine...")

        # Construct the command
        # -n htdemucs: Use the Hybrid Transformer model
        # --out: Output directory
        cmd = [
            "demucs",
            "-n", "htdemucs",
            "--two-stems", "vocals",
            "--out", output_dir,
            input_file
        ]

        print(json.dumps({"status": "starting", "command": " ".join(cmd)}))
        sys.stdout.flush()

        # 2. Run Demucs (Blocking call)
        # We assume this takes time. Ideally we'd parse progress from stdout, but for now we just wait.
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)

        # 3. Verify Output
        filename = os.path.basename(input_file)
        filename_no_ext = os.path.splitext(filename)[0]
        # output_dir/htdemucs/filename_no_ext/
        model_output_path = os.path.join(output_dir, "htdemucs", filename_no_ext)
        
        if os.path.exists(model_output_path):
             # Success!
             stems_map = {
                 "vocals": f"htdemucs/{filename_no_ext}/vocals.wav",
                 "no_vocals": f"htdemucs/{filename_no_ext}/no_vocals.wav"
             }
             
             write_status(output_dir, "completed", 100, "Separation complete!", {
                 "stems": stems_map,
                 "output_path": model_output_path
             })
             
             print(json.dumps({"status": "completed", "path": model_output_path}))
        else:
             # Path mismatch
             write_status(output_dir, "error", 100, "Output files not found after processing.", {
                 "raw_output": result.stdout
             })
             print(json.dumps({"status": "failed", "reason": "missing_output"}))

    except subprocess.CalledProcessError as e:
        write_status(output_dir, "error", 0, "Demucs process failed.", {
            "stderr": e.stderr
        })
        sys.exit(1)
    except Exception as e:
        write_status(output_dir, "error", 0, f"System error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Input audio file path")
    parser.add_argument("--out", required=True, help="Output directory")
    args = parser.parse_args()

    separate_audio(args.input, args.out)
