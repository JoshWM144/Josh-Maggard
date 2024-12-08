export interface AnimationObject {
  id: string;
  type: 'sphere' | 'cube' | 'cone';
  x: number;
  y: number;
  z?: number;
  scale: number;
  rotation: number;
  color: string;
  animation?: {
    type: 'rotate' | 'bounce' | 'scale';
    duration: number;
    delay?: number;
  };
}

export function createAnimation(obj: Partial<AnimationObject>): AnimationObject {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'sphere',
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rotation: 0,
    color: '#4A90E2',
    animation: {
      type: 'rotate',
      duration: 2,
    },
    ...obj,
  };
}

export function updateAnimation(obj: AnimationObject, progress: number): AnimationObject {
  const animation = obj.animation || { type: 'rotate', duration: 2 };
  
  switch (animation.type) {
    case 'bounce':
      return {
        ...obj,
        y: Math.sin(progress * Math.PI * 2) * 2,
      };
    case 'scale':
      return {
        ...obj,
        scale: 1 + Math.sin(progress * Math.PI * 2) * 0.3,
      };
    case 'rotate':
    default:
      return {
        ...obj,
        rotation: progress * Math.PI * 2,
      };
  }
}
