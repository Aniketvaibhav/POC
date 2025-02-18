import whisper
import sys
from pathlib import Path

def main():
    if len(sys.argv) < 2:
        print("Error: No audio file specified")
        sys.exit(1)
    
    try:
        audio_path = Path(sys.argv[1]).resolve()
        
        if not audio_path.exists():
            print(f"Error: File not found at {audio_path}")
            sys.exit(1)
        
        print("Loading Whisper model...")
        model = whisper.load_model("base")
        
        print("Starting transcription...")
        result = model.transcribe(str(audio_path))
        print("Transcription result:")
        print(result["text"])
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
