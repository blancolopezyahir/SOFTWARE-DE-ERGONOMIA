import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
import { HumanModel } from './HumanModel';
import type { Posture } from '../types/ergonomics';


export type CameraView = 'front' | 'side' | 'top' | 'free';

function OrbitController({ view }: { view: CameraView }) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const controller = new OrbitControlsImpl(camera, gl.domElement);
    controller.enableDamping = true;
    controller.minDistance = 2.5;
    controller.maxDistance = 8;
    controller.target.set(0, 1.4, 0);
    controls.current = controller;
    return () => controller.dispose();
  }, [camera, gl]);

  useEffect(() => {
    const target: [number, number, number] = [0, 1.4, 0];
    const positions: Record<Exclude<CameraView, 'free'>, [number, number, number]> = {
      front: [0, 1.8, 5.2],
      side: [5.2, 1.8, 0],
      top: [0.01, 6.2, 0.01]
    };
    if (view !== 'free' && controls.current) {
      camera.position.set(...positions[view]);
      controls.current.target.set(...target);
      camera.lookAt(...target);
      controls.current.update();
    }
  }, [view, camera]);

  useFrame(() => controls.current?.update());
  return null;
}

export function ErgoScene({ posture, cameraView }: { posture: Posture; cameraView: CameraView }) {
  return (
    <Canvas camera={{ position: [3.5, 2.3, 4.3], fov: 45 }} shadows>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 5]} intensity={1.35} castShadow />
      <OrbitController view={cameraView} />
      <gridHelper args={[7, 14, '#64748b', '#334155']} />
      <HumanModel posture={posture} />
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 7]} />
        <shadowMaterial opacity={0.25} />
      </mesh>
    </Canvas>
  );
}
