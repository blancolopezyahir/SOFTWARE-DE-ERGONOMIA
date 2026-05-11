import type { Posture, RiskLevel } from '../types/ergonomics';

const limits: Record<keyof Posture, { medium: number; high: number; label: string }> = {
  neck: { medium: 15, high: 30, label: 'cuello' },
  trunk: { medium: 20, high: 45, label: 'tronco' },
  shoulder: { medium: 45, high: 90, label: 'hombro' },
  elbow: { medium: 120, high: 145, label: 'codo' },
  wrist: { medium: 15, high: 30, label: 'muñeca' },
  hip: { medium: 45, high: 90, label: 'cadera' },
  knee: { medium: 60, high: 100, label: 'rodilla' },
  ankle: { medium: 10, high: 25, label: 'tobillo' }
};

export function evaluatePosture(posture: Posture): { score: number; level: RiskLevel; label: string; recommendations: string[] } {
  const entries = Object.entries(posture) as [keyof Posture, number][];
  const score = entries.reduce((total, [joint, value]) => {
    const abs = Math.abs(value);
    if (abs >= limits[joint].high) return total + 3;
    if (abs >= limits[joint].medium) return total + 1.5;
    return total + 0.4;
  }, 0);

  const level: RiskLevel = score < 8 ? 'low' : score < 15 ? 'medium' : 'high';
  const label = level === 'low' ? 'Verde: bajo' : level === 'medium' ? 'Amarillo: medio' : 'Rojo: alto';
  const critical = entries
    .filter(([joint, value]) => Math.abs(value) >= limits[joint].medium)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 4);

  const recommendations = critical.length
    ? critical.map(([joint]) => `Revisar ${limits[joint].label}: acercar la zona de trabajo, ajustar altura o reducir ángulos sostenidos.`)
    : ['La postura global se mantiene dentro de rangos bajos; conservar pausas activas y alternancia de tareas.'];

  return { score, level, label, recommendations };
}
