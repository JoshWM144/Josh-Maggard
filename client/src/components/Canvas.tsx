import { useEffect, useRef } from 'react';

interface CanvasProps {
  objects: any[];
  isPlaying: boolean;
}

export default function Canvas({ objects, isPlaying }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth - 32; // Accounting for padding
      canvas.height = parent.clientWidth * 0.5625; // 16:9 aspect ratio
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    let animationFrame: number;
    const render = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw objects
      objects.forEach(obj => {
        // Example drawing logic
        ctx.fillStyle = obj.color || '#000';
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius || 20, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isPlaying) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [objects, isPlaying]);

  return (
    <div className="relative bg-white rounded-lg shadow-inner">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
