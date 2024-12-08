import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { generateTextFromPrompt } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface PromptInputProps {
  onPromptSubmit: (prompt: string, generatedText: string) => void;
}

export default function PromptInput({ onPromptSubmit }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await generateTextFromPrompt(prompt);
      onPromptSubmit(prompt, response.generated_text);
      setPrompt('');
      toast({
        title: "Success",
        description: "Created new educational animation"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate animation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create Educational Animation</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe an educational concept..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
