import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Box, Circle, Triangle } from 'lucide-react';
import { createAnimation } from '../lib/animations';

interface ObjectLibraryProps {
  onObjectSelect: (object: any) => void;
}

export default function ObjectLibrary({ onObjectSelect }: ObjectLibraryProps) {
  const threeDShapes = [
    // Basic Shapes
    {
      name: 'Cube',
      icon: Box,
      category: 'basic',
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
      category: 'basic',
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
      category: 'basic',
      create: () => createAnimation({
        type: 'cone',
        x: 0,
        y: 0,
        scale: 1,
        color: '#50E24A'
      })
    },
    // Biology Shapes
    {
      name: 'Cell',
      icon: Circle,
      category: 'biology',
      create: () => createAnimation({
        type: 'sphere',
        x: 0,
        y: 0,
        scale: 1.2,
        color: '#7FE24A',
        animation: {
          type: 'scale',
          duration: 3
        }
      })
    },
    {
      name: 'DNA',
      icon: Circle,
      category: 'biology',
      create: () => createAnimation({
        type: 'dna',
        x: 0,
        y: 0,
        scale: 1,
        color: '#E24A9D',
        animation: {
          type: 'rotate',
          duration: 4
        }
      })
    },
    // Chemistry Shapes
    {
      name: 'Molecule',
      icon: Circle,
      category: 'chemistry',
      create: () => createAnimation({
        type: 'molecule',
        x: 0,
        y: 0,
        scale: 0.8,
        color: '#4AE2D5',
        animation: {
          type: 'bounce',
          duration: 2
        }
      })
    },
    {
      name: 'Atom',
      icon: Circle,
      category: 'chemistry',
      create: () => createAnimation({
        type: 'atom',
        x: 0,
        y: 0,
        scale: 1,
        color: '#E24A4A',
        animation: {
          type: 'rotate',
          duration: 3
        }
      })
    },
    // Math Shapes
    {
      name: 'Pyramid',
      icon: Triangle,
      category: 'math',
      create: () => createAnimation({
        type: 'pyramid',
        x: 0,
        y: 0,
        scale: 1,
        color: '#4A4AE2',
        animation: {
          type: 'rotate',
          duration: 3
        }
      })
    },
    {
      name: 'Torus',
      icon: Circle,
      category: 'math',
      create: () => createAnimation({
        type: 'torus',
        x: 0,
        y: 0,
        scale: 1,
        color: '#E2CF4A',
        animation: {
          type: 'rotate',
          duration: 4
        }
      })
    }
  ];

  const categories = Array.from(new Set(threeDShapes.map(shape => shape.category)));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">3D Object Library</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium capitalize text-muted-foreground">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {threeDShapes
                  .filter(shape => shape.category === category)
                  .map((shape) => (
                    <Button
                      key={shape.name}
                      variant="outline"
                      className="flex flex-col gap-2 h-auto py-4 hover:bg-muted/50 transition-colors"
                      onClick={() => onObjectSelect(shape.create())}
                    >
                      <shape.icon className="h-6 w-6" />
                      <span className="text-sm">{shape.name}</span>
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
