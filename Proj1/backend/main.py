import os
import re
import json
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(env_path)

# Initialize FastAPI app
app = FastAPI(title="Speech Analyzer Backend")

# Enable CORS for all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise RuntimeError("GROQ_API_KEY not found in environment variables.")

client = Groq(api_key=api_key)

# Local filler words list
FILLERS = ["um", "uh", "like", "you know", "so", "basically", "literally", "right", "okay", "well"]


def count_fillers(transcript: str) -> dict:
    text = transcript.lower()
    # Replace punctuation with spaces to prevent words from being glued to punctuation
    cleaned = re.sub(r"[^\w\s\']", " ", text)
    words = cleaned.split()
    
    counts = {}
    for word in FILLERS:
        if ' ' in word:
            # Multi-word phrase matching with boundary check
            phrase_count = len(re.findall(r"\b" + re.escape(word) + r"\b", text))
            if phrase_count > 0:
                counts[word] = phrase_count
        else:
            # Single-word matching
            c = words.count(word)
            if c > 0:
                counts[word] = c
    return counts


class AnalyzeRequest(BaseModel):
    transcript: str
    duration_seconds: float
    word_count: int


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    temp_path = None
    try:
        # Determine the file suffix (Whisper requires correct format extensions)
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".mp3"
        
        # Write Uploaded file contents to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Call Groq Whisper API
        with open(temp_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(temp_path), f.read()),
                model="whisper-large-v3",
                temperature=0,
                response_format="verbose_json",
            )
        
        # Support both model object and dict interfaces
        if isinstance(transcription, dict):
            transcript_text = transcription.get("text", "")
            duration = transcription.get("duration", 0.0)
        else:
            transcript_text = getattr(transcription, "text", "")
            duration = getattr(transcription, "duration", 0.0)
            
        word_count = len(transcript_text.split())
        
        return {
            "transcript": transcript_text,
            "duration_seconds": float(duration) if duration else 0.0,
            "word_count": word_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
        
    finally:
        # Clean up temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                pass


@app.post("/analyze")
async def analyze_speech(data: AnalyzeRequest):
    try:
        # WPM calculation: word_count divided by minutes
        duration = data.duration_seconds
        wpm = round((data.word_count / duration) * 60) if duration > 0 else 0
        
        # Calculate filler words locally
        fillers_detected = count_fillers(data.transcript)
        
        # Prepare structured prompt for Llama 3
        prompt = f"""You are a professional speech coach. Analyze this self-introduction transcript and return ONLY valid JSON.

Transcript: "{data.transcript}"
Speaking pace: {wpm} words per minute
Filler words detected: {fillers_detected}

Return this exact JSON structure:
{{
  "grammar": {{ "score": 0-100, "feedback": "...", "examples": ["..."] }},
  "vocabulary": {{ "score": 0-100, "feedback": "...", "level": "basic|intermediate|advanced" }},
  "structure": {{ "score": 0-100, "feedback": "...", "has_intro": true/false, "has_conclusion": true/false }},
  "confidence": {{ "score": 0-100, "feedback": "...", "hedging_words": ["..."] }},
  "overall_score": 0-100,
  "top_strength": "...",
  "top_improvement": "..."
}}"""

        # Call Groq LLM API
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        
        # Parse the JSON response
        llm_response = completion.choices[0].message.content
        scorecard = json.loads(llm_response)
        
        # Inject local metrics for the frontend to consume easily
        scorecard["wpm"] = wpm
        scorecard["filler_counts"] = fillers_detected
        scorecard["duration_seconds"] = duration
        scorecard["word_count"] = data.word_count
        
        return scorecard

    except json.JSONDecodeError as jde:
        raise HTTPException(status_code=500, detail=f"LLM returned invalid JSON: {str(jde)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
