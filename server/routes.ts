import type { Express } from "express";
import { Server } from "socket.io";
import axios from "axios";

let io: Server;

export function setupWebSocket(server: any) {
  io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Client joined room: ${roomId}`);
    });
    
    socket.on('animation-update', (data) => {
      socket.to(data.roomId).emit('animation-updated', data.objects);
    });
  });
}

export function registerRoutes(app: Express) {
  // Animation state endpoints
  app.post('/api/animations', async (req, res) => {
    const { prompt, objects } = req.body;
    
    try {
      // Call Python AI service for text generation
      const aiResponse = await axios.post(`http://localhost:${process.env.AI_SERVICE_PORT || 5001}/generate`, {
        prompt: prompt,
        context: {}
      });
      
      const aiData = aiResponse.data;
      
      // Emit the new animation to all clients in the room
      if (req.body.roomId) {
        io.to(req.body.roomId).emit('new-animation', {
          prompt,
          objects,
          ...aiData
        });
      }
      
      res.json({ 
        success: true,
        generated_text: aiData.generated_text,
        animation_type: aiData.animation_type,
        subject: aiData.subject,
        parameters: aiData.parameters
      });
    } catch (error) {
      console.error('Error processing animation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error processing animation request' 
      });
    }
  });

  app.get('/api/animations/:id', (req, res) => {
    const { id } = req.params;
    // Retrieve animation state
    res.json({ id, objects: [] });
  });

  app.put('/api/animations/:id', (req, res) => {
    const { id } = req.params;
    const { objects, roomId } = req.body;
    
    if (roomId) {
      io.to(roomId).emit('animation-updated', objects);
    }
    
    res.json({ success: true });
  });
}
