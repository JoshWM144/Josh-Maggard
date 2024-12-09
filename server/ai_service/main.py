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

# Educational templates for different subjects
EDUCATIONAL_TEMPLATES: Dict[str, str] = {
    "default": {
        "text": "Creating an interactive {object} to demonstrate {concept}",
        "primitive": "sphere",
        "animation_type": "rotate"
    },
    "physics": {
        "text": "Simulating {concept} with interactive {object}",
        "primitive": "cube",
        "animation_type": "physics"
    },
    "biology": {
        "text": "Visualizing {concept} through a detailed {object} model",
        "primitive": "sphere",
        "animation_type": "growth"
    },
    "chemistry": {
        "text": "Demonstrating {concept} through molecular {object}",
        "primitive": "sphere",
        "animation_type": "reaction"
    },
    "math": {
        "text": "Exploring {concept} using {object} visualization",
        "primitive": "cube",
        "animation_type": "transform"
    }
}

SUBJECT_KEYWORDS = {
    "physics": ["force", "motion", "gravity", "energy", "momentum", "collision"],
    "biology": ["cell", "organism", "system", "cycle", "photosynthesis", "mitosis"],
    "chemistry": ["reaction", "molecule", "atom", "bond", "solution"],
    "math": ["geometry", "equation", "graph", "function", "theorem"]
}

def identify_subject(prompt: str) -> str:
    """Identify the educational subject based on keywords in the prompt"""
    prompt_lower = prompt.lower()
    for subject, keywords in SUBJECT_KEYWORDS.items():
        if any(keyword in prompt_lower for keyword in keywords):
            return subject
    return "default"

def simple_generate_text(prompt: str) -> dict:
    """Generate educational animation description and parameters"""
    words = prompt.lower().split()
    
    # Identify subject and key elements
    subject = identify_subject(prompt)
    template = EDUCATIONAL_TEMPLATES[subject]
    
    # Extract key concepts and objects
    concept = " ".join(words[-3:]) if len(words) > 3 else prompt
    object_type = "model" if subject in ["biology", "chemistry"] else "visualization"
    
    # Generate response with animation parameters
    response = {
        "generated_text": template["text"].format(object=object_type, concept=concept),
        "animation_type": template["animation_type"],
        "subject": subject,
        "parameters": {
            "interactive": True,
            "complexity": "medium",
            "duration": 5,
        }
    }
    
    return response

class PromptRequest(BaseModel):
    prompt: str
    context: Dict[str, Any] = {}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "rule-based"}

@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        logger.info(f"Processing educational prompt: {request.prompt}")
        response = simple_generate_text(request.prompt)
        logger.info(f"Generated response for subject: {response['subject']}")
        return response
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
