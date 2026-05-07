import type { Posture } from '../types/ergonomics';

const deg = (value: number) => (value * Math.PI) / 180;

function Limb({ length, color = '#60a5fa' }: { length: number; color?: string }) {
  return (
    <group position={[0, -length / 2, 0]}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.09, length, 12, 24]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
    </group>
  );
}

function Joint({ color = '#f8fafc' }: { color?: string }) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshStandardMaterial color={color} metalness={0.05} roughness={0.35} />
    </mesh>
  );
}

export function HumanModel({ posture }: { posture: Posture }) {
  const seatedHip = posture.hip > 45;
  const trunkTilt = deg(posture.trunk);
  const neckTilt = deg(posture.neck);
  const shoulderLift = deg(posture.shoulder - 10);
  const elbowBend = deg(90 - posture.elbow);
  const wristBend = deg(posture.wrist);
  const hipFlex = deg(posture.hip);
  const kneeBend = deg(posture.knee);
  const ankleBend = deg(posture.ankle);

  return (
    <group position={[0, seatedHip ? 0.15 : 0, 0]}>
      <group rotation={[trunkTilt, 0, 0]}>
        <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.2, 0.36]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.5} />
        </mesh>
        <group position={[0, 2.45, 0]} rotation={[neckTilt, 0, 0]}>
          <Limb length={0.28} color="#cbd5e1" />
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.45} />
          </mesh>
        </group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.52, 2.2, 0]} rotation={[shoulderLift, 0, deg(side * 8)]}>
            <Joint color="#bae6fd" />
            <Limb length={0.55} />
            <group position={[0, -0.65, 0]} rotation={[elbowBend, 0, 0]}>
              <Joint color="#dbeafe" />
              <Limb length={0.5} color="#93c5fd" />
              <group position={[0, -0.6, 0]} rotation={[wristBend, 0, 0]}>
                <Joint color="#e0f2fe" />
                <mesh position={[0, -0.18, 0]} castShadow>
                  <boxGeometry args={[0.18, 0.25, 0.08]} />
                  <meshStandardMaterial color="#fbbf24" roughness={0.4} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.24, 1.1, 0]} rotation={[hipFlex, 0, 0]}>
          <Joint color="#bfdbfe" />
          <Limb length={0.75} color="#2563eb" />
          <group position={[0, -0.85, 0]} rotation={[-kneeBend, 0, 0]}>
            <Joint color="#dbeafe" />
            <Limb length={0.72} color="#3b82f6" />
            <group position={[0, -0.83, 0]} rotation={[ankleBend, 0, 0]}>
              <Joint color="#e0f2fe" />
              <mesh position={[0, -0.12, 0.12]} castShadow receiveShadow>
                <boxGeometry args={[0.22, 0.12, 0.42]} />
                <meshStandardMaterial color="#0f172a" roughness={0.7} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}
