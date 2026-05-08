import type { ErgonomicTask, RulaPosture } from '../types/rula';

const STORAGE_KEY = 'ergonomia-rula-tasks-v1';

const side = (upperArmFlexion=20, lowerArmFlexion=90, wristFlexion=0) => ({
  upperArmFlexion, shoulderRaised: false, upperArmAbducted: false, upperArmRotated: false, armSupported: false,
  lowerArmFlexion, lowerArmAcrossMidline: false, lowerArmOutToSide: false, wristFlexion, wristDeviation: false, wristTwist: 1 as const,
});

export const posturePresets: Record<string, { label: string; posture: RulaPosture }> = {
  desk: { label: 'Trabajo de escritorio', posture: { left: side(15, 95, 10), right: side(20, 95, 12), neckFlexion: 12, neckRotated: false, neckSideBent: false, trunkFlexion: 8, trunkSeatedSupported: true, trunkRotated: false, trunkSideBent: false, legSupport: 'seatedSupported', activity: 'static', load: 'under2Intermittent' } },
  assembly: { label: 'Ensamble manual', posture: { left: side(35, 75, 18), right: side(40, 70, 20), neckFlexion: 18, neckRotated: false, neckSideBent: false, trunkFlexion: 15, trunkSeatedSupported: false, trunkRotated: false, trunkSideBent: false, legSupport: 'standingBalanced', activity: 'repetitive', load: 'between2And10Intermittent' } },
  reach: { label: 'Alcance frontal', posture: { left: side(60, 115, 8), right: side(65, 115, 8), neckFlexion: 20, neckRotated: false, neckSideBent: false, trunkFlexion: 30, trunkSeatedSupported: false, trunkRotated: false, trunkSideBent: false, legSupport: 'standingBalanced', activity: 'dynamic', load: 'under2Intermittent' } },
  elevated: { label: 'Brazos elevados', posture: { left: {...side(105, 125, 20), shoulderRaised: true, upperArmAbducted: true}, right: {...side(110, 120, 22), shoulderRaised: true, upperArmAbducted: true}, neckFlexion: -5, neckRotated: false, neckSideBent: false, trunkFlexion: 10, trunkSeatedSupported: false, trunkRotated: false, trunkSideBent: false, legSupport: 'standingBalanced', activity: 'static', load: 'between2And10Static' } },
  wrist: { label: 'Tarea repetitiva de muñeca', posture: { left: side(25, 90, 25), right: {...side(30, 90, 30), wristDeviation: true, wristTwist: 2}, neckFlexion: 15, neckRotated: true, neckSideBent: false, trunkFlexion: 12, trunkSeatedSupported: false, trunkRotated: false, trunkSideBent: false, legSupport: 'standingBalanced', activity: 'repetitive', load: 'under2Intermittent' } },
};

export const createTask = (name = 'Nueva tarea RULA'): ErgonomicTask => ({
  id: crypto.randomUUID(), name, method: 'RULA', evaluatedSide: 'both', before: structuredClone(posturePresets.assembly.posture), after: structuredClone(posturePresets.desk.posture), updatedAt: new Date().toISOString(),
});

export function loadTasks(): ErgonomicTask[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ErgonomicTask[]; } catch { return []; }
}

export function saveTasks(tasks: ErgonomicTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
