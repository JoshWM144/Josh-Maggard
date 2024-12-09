export interface AnimationObject {
  id: string;
  x: number;
  y: number;
  scale: number;
  color: string;
  animation?: {
    duration: number;
  };
}

export function createAnimation(obj: Partial<AnimationObject>): AnimationObject {
  return {
    id: Math.random().toString(36).substr(2, 9),
    x: obj.x ?? 0,
    y: obj.y ?? 0,
    scale: obj.scale ?? 1,
    color: obj.color ?? '#4A90E2',
    animation: {
      duration: obj.animation?.duration ?? 2,
    },
  };
}
