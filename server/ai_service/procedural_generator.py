import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import logging

app = FastAPI()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GenerationRequest(BaseModel):
    prompt: str
    parameters: Dict[str, Any] = {}

class Vertex(BaseModel):
    x: float
    y: float
    z: float

class Face(BaseModel):
    vertices: List[int]

class Mesh(BaseModel):
    vertices: List[Vertex]
    faces: List[Face]
    material: Dict[str, Any]

def generate_primitive(primitive_type: str, size: float = 1.0) -> Mesh:
    """Generate basic 3D primitives based on type"""
    if primitive_type == "cube":
        # Generate cube vertices
        vertices = [
            Vertex(x=x, y=y, z=z)
            for x in [-size/2, size/2]
            for y in [-size/2, size/2]
            for z in [-size/2, size/2]
        ]
        
        # Generate cube faces
        faces = [
            Face(vertices=[0, 1, 2]), Face(vertices=[1, 2, 3]),  # front
            Face(vertices=[4, 5, 6]), Face(vertices=[5, 6, 7]),  # back
            Face(vertices=[0, 2, 4]), Face(vertices=[2, 4, 6]),  # top
            Face(vertices=[1, 3, 5]), Face(vertices=[3, 5, 7]),  # bottom
            Face(vertices=[0, 1, 4]), Face(vertices=[1, 4, 5]),  # left
            Face(vertices=[2, 3, 6]), Face(vertices=[3, 6, 7])   # right
        ]
        
    else:  # Default to sphere
        # Generate sphere using icosphere approximation
        phi = (1 + np.sqrt(5)) / 2
        vertices = [
            Vertex(x=0, y=1, z=phi),
            Vertex(x=0, y=-1, z=phi),
            # ... more vertices for icosphere
        ]
        faces = [
            Face(vertices=[0, 1, 2]),
            # ... more faces for icosphere
        ]
    
    return Mesh(
        vertices=vertices,
        faces=faces,
        material={
            "color": "#4A90E2",
            "roughness": 0.5,
            "metalness": 0.5
        }
    )

@app.post("/generate")
async def generate_mesh(request: GenerationRequest) -> Dict[str, Any]:
    """Generate a 3D mesh based on the prompt"""
    try:
        # Parse the prompt to determine what kind of object to generate
        primitive_type = "sphere"  # Default
        if "cube" in request.prompt.lower():
            primitive_type = "cube"
        
        # Generate the mesh
        mesh = generate_primitive(primitive_type)
        
        return {
            "success": True,
            "mesh": mesh.dict(),
            "metadata": {
                "prompt": request.prompt,
                "type": primitive_type
            }
        }
    except Exception as e:
        logger.error(f"Error generating mesh: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)
