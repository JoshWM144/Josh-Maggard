import axios from 'axios';
import type { InsertEducationalContent, EducationalContent, InsertUserProgress, UserProgress } from '@db/schema';

const API_BASE_URL = '/api';

export interface AIResponse {
  success: boolean;
  content: EducationalContent;
  generated_text: string;
  animation_type: string;
  subject: string;
  parameters: {
    interactive: boolean;
    complexity: string;
    duration: number;
  };
}

export async function generateTextFromPrompt(prompt: string, title?: string): Promise<AIResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/animations`, {
      prompt,
      title,
      context: {}
    });
    return response.data;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

export async function getEducationalContent(): Promise<EducationalContent[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/content`);
    return response.data;
  } catch (error) {
    console.error('Error fetching educational content:', error);
    throw error;
  }
}

export async function createEducationalContent(content: Partial<InsertEducationalContent>): Promise<EducationalContent> {
  try {
    const response = await axios.post(`${API_BASE_URL}/content`, content);
    return response.data;
  } catch (error) {
    console.error('Error creating educational content:', error);
    throw error;
  }
}

export async function saveUserProgress(progress: Partial<InsertUserProgress>): Promise<UserProgress> {
  try {
    const response = await axios.post(`${API_BASE_URL}/progress`, progress);
    return response.data;
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
}

export async function getUserProgress(userId: number): Promise<UserProgress[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}
