import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Box, Circle, Triangle } from 'lucide-react';
import { createAnimation } from '../lib/animations';

interface ObjectLibraryProps {
  onObjectSelect: (object: any) => void;
}

export default function ObjectLibrary({ onObjectSelect }: ObjectLibraryProps) {
  const threeDShapes = [
    {
      name: 'Cube',
      icon: Box,
      create: () => createAnimation({
        type: 'cube',
        x: 0,
        y: 0,
        scale: 1,
        color: '#4A90E2'
      })
    },
    {
      name: 'Sphere',
      icon: Circle,
      create: () => createAnimation({
        type: 'sphere',
        x: 0,
        y: 0,
        scale: 1,
        color: '#E24A77'
      })
    },
    {
      name: 'Cone',
      icon: Triangle,
      create: () => createAnimation({
        type: 'cone',
        x: 0,
        y: 0,
        scale: 1,
        color: '#50E24A'
      })
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">3D Object Library</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {threeDShapes.map((shape) => (
            <Button
              key={shape.name}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
              onClick={() => onObjectSelect(shape.create())}
            >
              <shape.icon className="h-6 w-6" />
              <span className="text-sm">{shape.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
