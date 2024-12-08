from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import json
import sys
import os
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
    try:
        start_port = int(os.getenv('PORT', '5001'))
        max_retries = 5
        current_try = 0
        port = start_port
        
        while current_try < max_retries:
            try:
                logger.info(f"Starting AI service on port {port}...")
                uvicorn.run(
                    app,
                    host="0.0.0.0",
                    port=port,
                    log_level="info",
                    reload=False
                )
                break
            except OSError as e:
                if "address already in use" in str(e).lower():
                    current_try += 1
                    if current_try < max_retries:
                        port += 1
                        logger.info(f"Port {port-1} in use, trying port {port}")
                    else:
                        logger.error("Could not find an available port after maximum retries")
                        sys.exit(1)
                else:
                    logger.error(f"Unexpected error: {str(e)}")
                    raise
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        sys.exit(1)
