import type { Express } from "express";
import { Server } from "socket.io";
import axios from "axios";
import { db } from "../db/index";
import { educationalContent, userProgress, users } from "../db/schema";
import { eq, and } from "drizzle-orm";

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
  // Educational content endpoints
  app.post('/api/content', async (req, res) => {
    const { title, description, subject, prompt, animationConfig, createdBy } = req.body;
    
    try {
      const content = await db.insert(educationalContent)
        .values({
          title,
          description,
          subject,
          prompt,
          animationConfig,
          createdBy: createdBy || null,
          isPublic: true
        })
        .returning();
      
      res.json(content[0]);
    } catch (error) {
      console.error('Error creating educational content:', error);
      res.status(500).json({ error: 'Failed to create educational content' });
    }
  });

  app.get('/api/content', async (_req, res) => {
    try {
      const content = await db.query.educationalContent.findMany({
        orderBy: (content, { desc }) => [desc(content.createdAt)]
      });
      res.json(content);
    } catch (error) {
      console.error('Error fetching educational content:', error);
      res.status(500).json({ error: 'Failed to fetch educational content' });
    }
  });

  // Animation state endpoints
  app.post('/api/animations', async (req, res) => {
    const { prompt, objects, title, description } = req.body;
    
    try {
      // Call Python AI service for text generation
      let aiResponse;
      try {
        aiResponse = await axios.post(`http://0.0.0.0:${process.env.AI_SERVICE_PORT || 5001}/generate`, {
          prompt: prompt,
          context: {}
        });
        console.log('AI service response received successfully');
      } catch (error: any) {
        console.error('Error connecting to AI service:', error?.message || 'Unknown error');
        // Provide fallback behavior
        aiResponse = { 
          data: {
            generated_text: prompt,
            animation_type: "rotate",
            subject: "default",
            parameters: {
              interactive: true,
              complexity: "medium",
              duration: 5
            }
          }
        };
      }
      
      const aiData = aiResponse.data;
      
      // Save the animation to the database
      const content = await db.insert(educationalContent)
        .values({
          title: title || prompt,
          description: description || aiData.generated_text,
          subject: aiData.subject,
          prompt,
          animationConfig: {
            objects,
            animation_type: aiData.animation_type,
            parameters: aiData.parameters
          },
          isPublic: true
        })
        .returning();
      
      // Emit the new animation to all clients in the room
      if (req.body.roomId) {
        io.to(req.body.roomId).emit('new-animation', {
          ...content[0],
          prompt,
          objects,
          ...aiData
        });
      }
      
      res.json({ 
        success: true,
        content: content[0],
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

  app.get('/api/animations/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const content = await db.query.educationalContent.findFirst({
        where: eq(educationalContent.id, parseInt(id))
      });
      
      if (!content) {
        return res.status(404).json({ error: 'Animation not found' });
      }
      
      res.json(content);
    } catch (error) {
      console.error('Error fetching animation:', error);
      res.status(500).json({ error: 'Failed to fetch animation' });
    }
  });

  // User progress endpoints
  app.post('/api/progress', async (req, res) => {
    const { userId, contentId, completed, notes, feedback } = req.body;
    
    try {
      const progress = await db.insert(userProgress)
        .values({
          userId,
          contentId,
          completed,
          notes,
          feedback
        })
        .returning();
      
      res.json(progress[0]);
    } catch (error) {
      console.error('Error saving user progress:', error);
      res.status(500).json({ error: 'Failed to save user progress' });
    }
  });

  app.get('/api/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const progress = await db.query.userProgress.findMany({
        where: eq(userProgress.userId, parseInt(userId)),
        with: {
          content: true
        }
      });
      
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  });

  app.put('/api/animations/:id', async (req, res) => {
    const { id } = req.params;
    const { objects, roomId } = req.body;
    
    try {
      // Update animation in database
      const content = await db.query.educationalContent.findFirst({
        where: eq(educationalContent.id, parseInt(id))
      });
      
      if (!content) {
        return res.status(404).json({ error: 'Animation not found' });
      }
      
      const updatedContent = await db
        .update(educationalContent)
        .set({
          animationConfig: {
            ...(content.animationConfig as Record<string, any>),
            objects
          }
        })
        .where(eq(educationalContent.id, parseInt(id)))
        .returning();
      
      if (roomId) {
        io.to(roomId).emit('animation-updated', objects);
      }
      
      res.json({ success: true, content: updatedContent[0] });
    } catch (error) {
      console.error('Error updating animation:', error);
      res.status(500).json({ error: 'Failed to update animation' });
    }
  });
}
