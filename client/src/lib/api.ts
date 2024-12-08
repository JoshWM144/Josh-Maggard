import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export interface AIResponse {
  generated_text: string;
}

export async function generateTextFromPrompt(prompt: string): Promise<AIResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      prompt,
      context: {}
    });
    return response.data;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}
