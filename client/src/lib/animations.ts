export interface AnimationObject {
  id: string;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
}

export function createAnimation(obj: Partial<AnimationObject>): AnimationObject {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'circle',
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    color: '#000000',
    ...obj,
  };
}

export function updateAnimation(obj: AnimationObject, progress: number): AnimationObject {
  return {
    ...obj,
    scale: 1 + Math.sin(progress * Math.PI * 2) * 0.2,
    rotation: progress * Math.PI * 2,
  };
}
