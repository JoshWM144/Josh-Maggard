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
      {objects.map((obj) => {
        switch (obj.type) {
          case 'sphere':
          case 'cell':
            return (
              <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={obj.color} />
              </mesh>
            );
          case 'cube':
            return (
              <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={obj.color} />
              </mesh>
            );
          case 'cone':
            return (
              <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <coneGeometry args={[1, 2, 32]} />
                <meshStandardMaterial color={obj.color} />
              </mesh>
            );
          case 'dna':
            return (
              <group key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <mesh position={[-0.5, 0, 0]}>
                  <torusGeometry args={[1, 0.2, 16, 100]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
                <mesh position={[0.5, 0, 0]}>
                  <torusGeometry args={[1, 0.2, 16, 100]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
              </group>
            );
          case 'molecule':
            return (
              <group key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale}>
                <mesh>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
                <mesh position={[1, 0, 0]}>
                  <sphereGeometry args={[0.3, 32, 32]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
                <mesh position={[-0.8, 0.8, 0]}>
                  <sphereGeometry args={[0.3, 32, 32]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
              </group>
            );
          case 'atom':
            return (
              <group key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <mesh>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 3]}>
                  <torusGeometry args={[1, 0.1, 16, 100]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                  <torusGeometry args={[1, 0.1, 16, 100]} />
                  <meshStandardMaterial color={obj.color} />
                </mesh>
              </group>
            );
          case 'pyramid':
            return (
              <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <coneGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color={obj.color} />
              </mesh>
            );
          case 'torus':
            return (
              <mesh key={obj.id} position={[obj.x, obj.y, 0]} scale={obj.scale} rotation={[0, obj.rotation, 0]}>
                <torusGeometry args={[1, 0.3, 16, 100]} />
                <meshStandardMaterial color={obj.color} />
              </mesh>
            );
          default:
            return null;
        }
      })}
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
