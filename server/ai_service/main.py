from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import json
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple rule-based text generation as fallback
EDUCATIONAL_TEMPLATES: Dict[str, str] = {
    "default": "This is an interactive {object} that demonstrates {concept}.",
    "physics": "The {object} shows how {concept} works in physics.",
    "math": "This {object} helps visualize {concept} in mathematics.",
    "chemistry": "The {object} represents {concept} in chemical reactions.",
}

def simple_generate_text(prompt: str) -> str:
    """Fallback text generation when ML model is not available"""
    words = prompt.lower().split()
    
    # Identify subject area and key concepts
    subject = next((s for s in ["physics", "math", "chemistry"] if s in words), "default")
    concept = " ".join(words[-2:]) if len(words) > 2 else "educational concepts"
    object_type = words[0] if words else "visualization"
    
    template = EDUCATIONAL_TEMPLATES[subject]
    return template.format(object=object_type, concept=concept)

class PromptRequest(BaseModel):
    prompt: str
    context: Dict[str, Any] = {}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "rule-based"}

@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        logger.info(f"Processing prompt: {request.prompt}")
        generated_text = simple_generate_text(request.prompt)
        logger.info("Text generated successfully")
        return {"generated_text": generated_text}
    except Exception as e:
        logger.error(f"Error generating text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting AI service on port 5001...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        log_level="info",
        reload=True,  # Enable auto-reload for development
    )
