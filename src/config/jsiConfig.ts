import type { JsiFactorConfig, JsiFactorKey } from '../types/ergonomics';

export const jsiFactors: Record<JsiFactorKey, JsiFactorConfig> = {
  intensity: {
    label: 'Intensidad del esfuerzo',
    shortLabel: 'Intensidad',
    unitHint: 'Percepción del esfuerzo requerido',
    options: [
      { id: 'light', label: 'Ligero', description: 'Esfuerzo apenas perceptible', multiplier: 1 },
      { id: 'somewhat-hard', label: 'Algo intenso', description: 'Esfuerzo evidente pero sostenible', multiplier: 3 },
      { id: 'hard', label: 'Intenso', description: 'Uso claro de fuerza o agarre sostenido', multiplier: 6 },
      { id: 'very-hard', label: 'Muy intenso', description: 'Fuerza alta con fatiga rápida', multiplier: 9 },
      { id: 'near-max', label: 'Casi máximo', description: 'Esfuerzo cercano al máximo voluntario', multiplier: 13 }
    ]
  },
  duration: {
    label: 'Duración del esfuerzo',
    shortLabel: 'Duración esfuerzo',
    unitHint: 'Porcentaje del ciclo con esfuerzo',
    options: [
      { id: 'lt10', label: '< 10%', description: 'Esfuerzo breve dentro del ciclo', multiplier: 0.5 },
      { id: '10-29', label: '10% - 29%', description: 'Esfuerzo intermitente', multiplier: 1 },
      { id: '30-49', label: '30% - 49%', description: 'Esfuerzo frecuente', multiplier: 1.5 },
      { id: '50-79', label: '50% - 79%', description: 'Esfuerzo predominante', multiplier: 2 },
      { id: 'gte80', label: '≥ 80%', description: 'Esfuerzo casi continuo', multiplier: 3 }
    ]
  },
  effortsPerMinute: {
    label: 'Esfuerzos por minuto',
    shortLabel: 'Frecuencia',
    unitHint: 'Cantidad de acciones de fuerza por minuto',
    options: [
      { id: 'lt4', label: '< 4', description: 'Frecuencia baja', multiplier: 0.5 },
      { id: '4-8', label: '4 - 8', description: 'Frecuencia moderada', multiplier: 1 },
      { id: '9-14', label: '9 - 14', description: 'Frecuencia elevada', multiplier: 1.5 },
      { id: '15-19', label: '15 - 19', description: 'Frecuencia alta', multiplier: 2 },
      { id: 'gte20', label: '≥ 20', description: 'Frecuencia muy alta', multiplier: 3 }
    ]
  },
  handWristPosture: {
    label: 'Postura mano-muñeca',
    shortLabel: 'Muñeca',
    unitHint: 'Desviación, flexión o extensión observada',
    options: [
      { id: 'very-good', label: 'Muy buena', description: 'Muñeca neutra', multiplier: 1 },
      { id: 'good', label: 'Buena', description: 'Desviación leve y ocasional', multiplier: 1 },
      { id: 'fair', label: 'Regular', description: 'Flexión, extensión o desviación visible', multiplier: 1.5 },
      { id: 'bad', label: 'Mala', description: 'Postura forzada frecuente', multiplier: 2 },
      { id: 'very-bad', label: 'Muy mala', description: 'Postura extrema o sostenida', multiplier: 3 }
    ]
  },
  speedOfWork: {
    label: 'Velocidad de trabajo',
    shortLabel: 'Velocidad',
    unitHint: 'Ritmo observado o impuesto',
    options: [
      { id: 'very-slow', label: 'Muy lenta', description: 'Ritmo controlado por la persona', multiplier: 1 },
      { id: 'slow', label: 'Lenta', description: 'Ritmo cómodo', multiplier: 1 },
      { id: 'fair', label: 'Media', description: 'Ritmo normal con pausas', multiplier: 1 },
      { id: 'fast', label: 'Rápida', description: 'Ritmo exigente', multiplier: 1.5 },
      { id: 'very-fast', label: 'Muy rápida', description: 'Ritmo impuesto o difícil de sostener', multiplier: 2 }
    ]
  },
  taskDurationPerDay: {
    label: 'Duración de la tarea por día',
    shortLabel: 'Duración diaria',
    unitHint: 'Horas acumuladas por jornada',
    options: [
      { id: 'lt1', label: '< 1 h', description: 'Exposición corta', multiplier: 0.25 },
      { id: '1-2', label: '1 - 2 h', description: 'Exposición baja', multiplier: 0.5 },
      { id: '2-4', label: '2 - 4 h', description: 'Exposición moderada', multiplier: 0.75 },
      { id: '4-8', label: '4 - 8 h', description: 'Exposición alta', multiplier: 1 },
      { id: 'gte8', label: '≥ 8 h', description: 'Exposición extendida', multiplier: 1.5 }
    ]
  }
};

export const jsiFactorOrder = Object.keys(jsiFactors) as JsiFactorKey[];

export const jsiRecommendations: Record<JsiFactorKey, string> = {
  intensity: 'Reducir la fuerza requerida con ayudas mecánicas, mangos adecuados, afilado de herramientas o rediseño del agarre.',
  duration: 'Disminuir el tiempo continuo de esfuerzo incorporando micro-pausas, alternancia de manos o rediseño del ciclo.',
  effortsPerMinute: 'Bajar la frecuencia con balanceo de línea, automatización parcial o acumuladores que eliminen picos repetitivos.',
  handWristPosture: 'Mantener la muñeca neutra ajustando altura, orientación de piezas, herramienta o punto de contacto.',
  speedOfWork: 'Ajustar el ritmo de producción, agregar pausas planificadas y evitar cadencias impuestas sin recuperación.',
  taskDurationPerDay: 'Rotar tareas, limitar exposición diaria y distribuir la tarea entre estaciones con demandas diferentes.'
};
