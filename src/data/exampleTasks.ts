import { predefinedPostures } from './postures';
import type { ErgonomicTask } from '../types/ergonomics';

export const exampleTasks: ErgonomicTask[] = [
  {
    id: 'ejemplo-escritorio',
    name: 'Tarea de escritorio',
    description: 'Digitación y uso de mouse con postura sentada.',
    postureName: 'escritorio',
    posture: predefinedPostures.escritorio,
    scenario: 'antes',
    updatedAt: new Date('2026-01-01T09:00:00.000Z').toISOString(),
    jsi: {
      intensity: 'light',
      duration: '10-29',
      effortsPerMinute: '9-14',
      handWristPosture: 'fair',
      speedOfWork: 'fair',
      taskDurationPerDay: '4-8'
    }
  },
  {
    id: 'ejemplo-ensamble',
    name: 'Tarea de ensamble manual',
    description: 'Colocación repetitiva de piezas pequeñas con pinza manual.',
    postureName: 'alcance',
    posture: predefinedPostures.alcance,
    scenario: 'antes',
    updatedAt: new Date('2026-01-01T10:00:00.000Z').toISOString(),
    jsi: {
      intensity: 'hard',
      duration: '30-49',
      effortsPerMinute: '15-19',
      handWristPosture: 'bad',
      speedOfWork: 'fast',
      taskDurationPerDay: '4-8'
    }
  },
  {
    id: 'ejemplo-levantamiento',
    name: 'Levantamiento o alcance repetitivo',
    description: 'Toma de cajas ligeras desde contenedor bajo y alcance a estante.',
    postureName: 'levantamiento',
    posture: predefinedPostures.levantamiento,
    scenario: 'antes',
    updatedAt: new Date('2026-01-01T11:00:00.000Z').toISOString(),
    jsi: {
      intensity: 'very-hard',
      duration: '50-79',
      effortsPerMinute: '9-14',
      handWristPosture: 'fair',
      speedOfWork: 'fast',
      taskDurationPerDay: '2-4'
    }
  }
];
