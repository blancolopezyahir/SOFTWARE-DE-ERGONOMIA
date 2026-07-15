import type { ActivityType, LoadType } from '../types/rula';

export interface RangeRule { label: string; min?: number; max?: number; score: number; }

export const rulaConfig = {
  source: 'Basado en la explicación del método RULA de Ergonautas/UPV: https://www.ergonautas.upv.es/metodos/rula/rula-ayuda.php',
  ranges: {
    upperArm: [
      { label: '20° extensión a 20° flexión', min: -20, max: 20, score: 1 },
      { label: 'extensión >20° o flexión >20° y <45°', min: -180, max: -20.0001, score: 2 },
      { label: 'flexión >20° y <45°', min: 20.0001, max: 45, score: 2 },
      { label: 'flexión >45° y ≤90°', min: 45.0001, max: 90, score: 3 },
      { label: 'flexión >90°', min: 90.0001, max: 180, score: 4 },
    ],
    lowerArm: [
      { label: 'flexión entre 60° y 100°', min: 60, max: 100, score: 1 },
      { label: 'flexión <60° o >100°', min: 0, max: 59.999, score: 2 },
      { label: 'flexión <60° o >100°', min: 100.001, max: 180, score: 2 },
    ],
    wrist: [
      { label: 'posición neutra', min: 0, max: 0, score: 1 },
      { label: 'flexión/extensión >0° y <15°', min: 0.001, max: 15, score: 2 },
      { label: 'flexión/extensión >15°', min: 15.001, max: 90, score: 3 },
    ],
    neck: [
      { label: 'flexión entre 0° y 10°', min: 0, max: 10, score: 1 },
      { label: 'flexión >10° y ≤20°', min: 10.001, max: 20, score: 2 },
      { label: 'flexión >20°', min: 20.001, max: 90, score: 3 },
      { label: 'extensión', min: -90, max: -0.001, score: 4 },
    ],
    trunk: [
      { label: 'erguido/sentado bien apoyado', min: 0, max: 0, score: 1 },
      { label: 'flexión >0° y ≤20°', min: 0.001, max: 20, score: 2 },
      { label: 'flexión >20° y ≤60°', min: 20.001, max: 60, score: 3 },
      { label: 'flexión >60°', min: 60.001, max: 120, score: 4 },
    ],
  },
  activityScores: {
    dynamic: { score: 0, label: 'Ocasional, poco frecuente y de corta duración' },
    static: { score: 1, label: 'Estática: se mantiene más de un minuto' },
    repetitive: { score: 1, label: 'Repetitiva: más de 4 veces por minuto' },
  } satisfies Record<ActivityType, {score:number; label:string}>,
  loadScores: {
    under2Intermittent: { score: 0, label: 'Carga menor de 2 kg intermitente' },
    between2And10Intermittent: { score: 1, label: 'Carga 2–10 kg intermitente' },
    between2And10Static: { score: 2, label: 'Carga 2–10 kg estática/repetitiva' },
    over10Intermittent: { score: 2, label: 'Carga >10 kg intermitente' },
    over10Static: { score: 3, label: 'Carga >10 kg estática/repetitiva' },
    shock: { score: 3, label: 'Golpes o fuerzas bruscas' },
  } satisfies Record<LoadType, {score:number; label:string}>,
  actionLevels: [
    { min: 1, max: 2, level: 1, label: 'Postura aceptable', description: 'Riesgo aceptable si no se mantiene o repite durante periodos prolongados.', color: '#38a169' },
    { min: 3, max: 4, level: 2, label: 'Investigar y considerar cambios', description: 'Conviene profundizar el estudio; pueden requerirse cambios.', color: '#d69e2e' },
    { min: 5, max: 6, level: 3, label: 'Rediseño o intervención requerida', description: 'Se requiere rediseñar la tarea o aplicar medidas correctivas.', color: '#dd6b20' },
    { min: 7, max: 7, level: 4, label: 'Cambios urgentes', description: 'Se requieren cambios urgentes en la tarea.', color: '#c53030' },
  ],
  // Tabla 13 de RULA: brazo (1-6), antebrazo (1-3), muñeca (1-4), giro muñeca (1-2).
  tableA: [
    [[1,2,2,2,2,3,3,3],[2,2,2,2,3,3,3,3],[2,3,3,3,3,3,4,4]],
    [[2,3,3,3,3,4,4,4],[3,3,3,3,3,4,4,4],[3,4,4,4,4,4,5,5]],
    [[3,3,4,4,4,4,5,5],[3,4,4,4,4,4,5,5],[4,4,4,4,4,5,5,5]],
    [[4,4,4,4,4,5,5,5],[4,4,4,4,4,5,5,5],[4,4,4,5,5,5,6,6]],
    [[5,5,5,5,5,6,6,7],[5,6,6,6,6,7,7,7],[6,6,6,7,7,7,7,8]],
    [[7,7,7,7,7,8,8,9],[8,8,8,8,8,9,9,9],[9,9,9,9,9,9,9,9]],
  ],
  // Tabla 14 de RULA: cuello (1-6), tronco (1-6), piernas (1-2).
  tableB: [
    [[1,3],[2,3],[3,4],[5,5],[6,6],[7,7]],
    [[2,3],[2,3],[4,5],[5,5],[6,7],[7,7]],
    [[3,3],[3,4],[4,5],[5,6],[6,7],[7,7]],
    [[5,5],[5,6],[6,7],[7,7],[7,7],[8,8]],
    [[7,7],[7,7],[7,8],[8,8],[8,8],[8,8]],
    [[8,8],[8,8],[8,8],[8,9],[9,9],[9,9]],
  ],
  // Tabla 17 de RULA: puntuación C (1-8), puntuación D (1-7, se limita si supera 7).
  finalTable: [
    [1,2,3,3,4,5,5],
    [2,2,3,4,4,5,5],
    [3,3,3,4,4,5,6],
    [3,3,3,4,5,6,6],
    [4,4,4,5,6,7,7],
    [4,4,5,6,6,7,7],
    [5,5,6,6,7,7,7],
    [5,5,6,7,7,7,7],
  ],
  recommendations: {
    upperArm: 'Reducir flexión/elevación del brazo, acercar la tarea y apoyar el antebrazo cuando sea posible.',
    lowerArm: 'Situar la tarea para mantener el codo aproximadamente entre 60° y 100°.',
    wrist: 'Mantener la muñeca neutra; ajustar altura, herramienta o agarre para reducir flexión, desviación y pronosupinación extrema.',
    neck: 'Elevar o acercar el plano de trabajo para evitar flexión, giro o inclinación del cuello.',
    trunk: 'Ajustar alcance y altura del puesto para evitar flexión, giro o inclinación del tronco.',
    legs: 'Mejorar apoyo de pies, estabilidad y distribución simétrica del peso.',
    activity: 'Introducir pausas, alternancia de tareas o rotación para reducir postura estática/repetitiva.',
    load: 'Reducir carga, usar ayudas mecánicas o rediseñar el agarre para minimizar fuerzas.',
  },
};
