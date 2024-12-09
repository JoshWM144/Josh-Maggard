import { useRef, useEffect } from 'react';
import { AnimationObject } from '../lib/animations';
import { gsap } from 'gsap';

interface CanvasProps {
  objects: AnimationObject[];
  isPlaying: boolean;
}

export default function Canvas({ objects, isPlaying }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const elements = objects.map((obj) => {
      const element = document.createElement('div');
      element.className = 'absolute rounded-full transition-all duration-300';
      element.style.backgroundColor = obj.color;
      element.style.width = `${obj.scale * 50}px`;
      element.style.height = `${obj.scale * 50}px`;
      element.style.left = `${(obj.x + 2) * 25}%`;
      element.style.top = `${(obj.y + 2) * 25}%`;
      return element;
    });

    elements.forEach(el => canvasRef.current?.appendChild(el));

    if (isPlaying) {
      elements.forEach((el, i) => {
        const obj = objects[i];
        gsap.to(el, {
          rotation: 360,
          scale: obj.scale * 1.2,
          duration: obj.animation?.duration || 2,
          repeat: -1,
          ease: "none",
          yoyo: true
        });
      });
    }

    return () => {
      elements.forEach(el => {
        gsap.killTweensOf(el);
        el.remove();
      });
    };
  }, [objects, isPlaying]);

  return (
    <div 
      ref={canvasRef} 
      className="relative bg-white rounded-lg shadow-inner w-full h-[600px] overflow-hidden"
    />
  );
}
