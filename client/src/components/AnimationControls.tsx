import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

export default function AnimationControls({
  isPlaying,
  onPlayPause,
  onReset,
}: AnimationControlsProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className="w-12 h-12"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="w-12 h-12"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>
    </div>
  );
}
