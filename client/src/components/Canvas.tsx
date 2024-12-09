import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { AnimationObject } from '../lib/animations';

interface CanvasProps {
  objects: AnimationObject[];
  isPlaying: boolean;
}

function Scene({ objects, isPlaying }: CanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (isPlaying && groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 8,
        ease: 'none',
        repeat: -1
      });
    } else if (!isPlaying && groupRef.current) {
      gsap.killTweensOf(groupRef.current.rotation);
    }
  }, [isPlaying]);

  return (
    <group ref={groupRef}>
      {objects.map((obj) => (
        <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={obj.color} />
        </mesh>
      ))}
    </group>
  );
}

export default function Canvas(props: CanvasProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-inner" style={{ height: '600px' }}>
      <ThreeCanvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls enableDamping />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene {...props} />
      </ThreeCanvas>
    </div>
  );
}
