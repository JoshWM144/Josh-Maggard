import axios from 'axios';

const API_BASE_URL = '/api';

export interface AIResponse {
  generated_text: string;
  animation_type: string;
  subject: string;
  parameters: {
    interactive: boolean;
    complexity: string;
    duration: number;
  };
}

export async function generateTextFromPrompt(prompt: string): Promise<AIResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/animations`, {
      prompt,
      context: {}
    });
    return response.data;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}
