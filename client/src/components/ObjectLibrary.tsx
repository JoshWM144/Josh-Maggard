import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Square, Circle, Triangle } from 'lucide-react';

interface ObjectLibraryProps {
  onObjectSelect: (object: any) => void;
}

export default function ObjectLibrary({ onObjectSelect }: ObjectLibraryProps) {
  const basicShapes = [
    { name: 'Square', icon: Square, props: { type: 'square', size: 50 } },
    { name: 'Circle', icon: Circle, props: { type: 'circle', radius: 25 } },
    { name: 'Triangle', icon: Triangle, props: { type: 'triangle', size: 50 } },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Object Library</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {basicShapes.map((shape) => (
            <Button
              key={shape.name}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4"
              onClick={() => onObjectSelect(shape.props)}
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
