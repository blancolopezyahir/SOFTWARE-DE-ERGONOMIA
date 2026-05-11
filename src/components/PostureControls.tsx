import type { JointKey, Posture, PostureName } from '../types/ergonomics';
import { postureLabels, predefinedPostures } from '../data/postures';

const jointLabels: Record<JointKey, string> = {
  neck: 'Cuello',
  trunk: 'Tronco',
  shoulder: 'Hombro',
  elbow: 'Codo',
  wrist: 'Muñeca',
  hip: 'Cadera',
  knee: 'Rodilla',
  ankle: 'Tobillo'
};

const ranges: Record<JointKey, [number, number]> = {
  neck: [-35, 45],
  trunk: [-20, 70],
  shoulder: [-20, 130],
  elbow: [0, 150],
  wrist: [-45, 45],
  hip: [-20, 110],
  knee: [0, 130],
  ankle: [-25, 35]
};

export function PostureControls({
  posture,
  onPostureChange,
  onPreset
}: {
  posture: Posture;
  onPostureChange: (posture: Posture) => void;
  onPreset: (name: PostureName) => void;
}) {
  const joints = Object.keys(posture) as JointKey[];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Postura 3D</h2>
        <span>grados</span>
      </div>
      <div className="preset-grid">
        {(Object.keys(predefinedPostures) as PostureName[]).map((name) => (
          <button key={name} className="secondary" onClick={() => onPreset(name)}>
            {postureLabels[name]}
          </button>
        ))}
      </div>
      <div className="sliders">
        {joints.map((joint) => (
          <label key={joint} className="slider-row">
            <span>{jointLabels[joint]}</span>
            <input
              type="range"
              min={ranges[joint][0]}
              max={ranges[joint][1]}
              value={posture[joint]}
              onChange={(event) => onPostureChange({ ...posture, [joint]: Number(event.target.value) })}
            />
            <strong>{posture[joint]}°</strong>
          </label>
        ))}
      </div>
    </section>
  );
}
