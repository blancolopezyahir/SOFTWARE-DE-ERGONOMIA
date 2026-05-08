import { rulaConfig, type RangeRule } from '../config/rulaConfig';
import type { BodySide, EvaluationSide, RulaEvaluationResult, RulaPosture, RulaSideResult, SegmentScore, SidePosture } from '../types/rula';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function scoreRange(value: number, ranges: RangeRule[]) {
  const absAware = ranges === rulaConfig.ranges.wrist ? Math.abs(value) : value;
  return ranges.find((range) => (range.min === undefined || absAware >= range.min) && (range.max === undefined || absAware <= range.max)) ?? ranges[ranges.length - 1];
}

function wristColumn(wristScore: number, twist: 1 | 2) {
  return (clamp(wristScore, 1, 4) - 1) * 2 + (twist - 1);
}

function getActionLevel(finalScore: number) {
  return rulaConfig.actionLevels.find((level) => finalScore >= level.min && finalScore <= level.max) ?? rulaConfig.actionLevels[rulaConfig.actionLevels.length - 1];
}

function scoreUpperArm(side: SidePosture): SegmentScore {
  const base = scoreRange(side.upperArmFlexion, rulaConfig.ranges.upperArm);
  const modifiers: string[] = [];
  let score = base.score;
  // RULA suma +1 si hombro elevado, abducción o rotación; resta -1 si existe apoyo.
  if (side.shoulderRaised) { score += 1; modifiers.push('hombro elevado +1'); }
  if (side.upperArmAbducted) { score += 1; modifiers.push('brazo abducido +1'); }
  if (side.upperArmRotated) { score += 1; modifiers.push('brazo rotado +1'); }
  if (side.armSupported) { score -= 1; modifiers.push('brazo apoyado -1'); }
  score = clamp(score, 1, 6);
  return { key: 'upperArm', label: 'Brazo', score, baseScore: base.score, modifiers, angle: side.upperArmFlexion, explanation: `Brazo en ${base.label}.` };
}

function scoreLowerArm(side: SidePosture): SegmentScore {
  const base = scoreRange(side.lowerArmFlexion, rulaConfig.ranges.lowerArm);
  const modifiers: string[] = [];
  let score = base.score;
  // Las condiciones de cruzar línea media o trabajo lateral son excluyentes en RULA: máximo +1.
  if (side.lowerArmAcrossMidline || side.lowerArmOutToSide) {
    score += 1;
    modifiers.push(side.lowerArmAcrossMidline ? 'cruza línea media +1' : 'trabajo a un lado +1');
  }
  score = clamp(score, 1, 3);
  return { key: 'lowerArm', label: 'Antebrazo', score, baseScore: base.score, modifiers, angle: side.lowerArmFlexion, explanation: `Antebrazo en ${base.label}.` };
}

function scoreWrist(side: SidePosture): SegmentScore {
  const base = scoreRange(side.wristFlexion, rulaConfig.ranges.wrist);
  const modifiers: string[] = [];
  let score = base.score;
  if (side.wristDeviation) { score += 1; modifiers.push('desviación radial/cubital +1'); }
  score = clamp(score, 1, 4);
  return { key: 'wrist', label: 'Muñeca', score, baseScore: base.score, modifiers, angle: side.wristFlexion, explanation: `Muñeca en ${base.label}; giro ${side.wristTwist === 1 ? 'medio/neutro' : 'extremo'}.` };
}

function scoreNeck(posture: RulaPosture): SegmentScore {
  const base = scoreRange(posture.neckFlexion, rulaConfig.ranges.neck);
  const modifiers: string[] = [];
  let score = base.score;
  if (posture.neckRotated) { score += 1; modifiers.push('cuello rotado +1'); }
  if (posture.neckSideBent) { score += 1; modifiers.push('inclinación lateral +1'); }
  score = clamp(score, 1, 6);
  return { key: 'neck', label: 'Cuello', score, baseScore: base.score, modifiers, angle: posture.neckFlexion, explanation: `Cuello en ${base.label}.` };
}

function scoreTrunk(posture: RulaPosture): SegmentScore {
  const base = posture.trunkSeatedSupported ? { label: 'sentado bien apoyado', score: 1 } : scoreRange(posture.trunkFlexion, rulaConfig.ranges.trunk);
  const modifiers: string[] = [];
  let score = base.score;
  if (posture.trunkRotated) { score += 1; modifiers.push('tronco rotado +1'); }
  if (posture.trunkSideBent) { score += 1; modifiers.push('inclinación lateral +1'); }
  score = clamp(score, 1, 6);
  return { key: 'trunk', label: 'Tronco', score, baseScore: base.score, modifiers, angle: posture.trunkFlexion, explanation: `Tronco ${base.label}.` };
}

function scoreLegs(posture: RulaPosture): SegmentScore {
  const supported = posture.legSupport !== 'unsupportedOrUnbalanced';
  return { key: 'legs', label: 'Piernas', score: supported ? 1 : 2, modifiers: [], explanation: supported ? 'Pies/piernas apoyados o peso simétrico.' : 'Apoyo insuficiente o peso no distribuido simétricamente.' };
}

export function evaluateRulaSide(posture: RulaPosture, side: BodySide): RulaSideResult {
  const sidePosture = posture[side];
  const upperArm = scoreUpperArm(sidePosture);
  const lowerArm = scoreLowerArm(sidePosture);
  const wrist = scoreWrist(sidePosture);
  const neck = scoreNeck(posture);
  const trunk = scoreTrunk(posture);
  const legs = scoreLegs(posture);

  // Tabla A cruza brazo, antebrazo, muñeca y giro de muñeca para producir la puntuación postural del Grupo A.
  const groupA = rulaConfig.tableA[upperArm.score - 1][lowerArm.score - 1][wristColumn(wrist.score, sidePosture.wristTwist)];
  // Tabla B cruza cuello, tronco y piernas para producir la puntuación postural del Grupo B.
  const groupB = rulaConfig.tableB[neck.score - 1][trunk.score - 1][legs.score - 1];
  const activityAdjustment = rulaConfig.activityScores[posture.activity].score;
  const loadAdjustment = rulaConfig.loadScores[posture.load].score;
  // Las puntuaciones C y D se obtienen sumando actividad y carga a Grupo A y Grupo B respectivamente.
  const scoreC = clamp(groupA + activityAdjustment + loadAdjustment, 1, 8);
  const scoreD = clamp(groupB + activityAdjustment + loadAdjustment, 1, 7);
  const finalScore = rulaConfig.finalTable[scoreC - 1][scoreD - 1];
  const action = getActionLevel(finalScore);
  const segments = [upperArm, lowerArm, wrist, neck, trunk, legs];
  const drivers = [...segments].sort((a, b) => b.score - a.score).slice(0, 3);
  const recommendations = Array.from(new Set([
    ...drivers.map((driver) => rulaConfig.recommendations[driver.key as keyof typeof rulaConfig.recommendations]),
    activityAdjustment ? rulaConfig.recommendations.activity : '',
    loadAdjustment ? rulaConfig.recommendations.load : '',
  ].filter(Boolean)));

  return {
    side,
    finalScore,
    actionLevel: action.level,
    actionLabel: action.label,
    actionDescription: action.description,
    color: action.color,
    groupA,
    groupB,
    scoreC,
    scoreD,
    activityAdjustment,
    loadAdjustment,
    segments,
    drivers,
    recommendations,
    explanation: `Grupo A=${groupA}, Grupo B=${groupB}; actividad +${activityAdjustment}, fuerza/carga +${loadAdjustment}; C=${scoreC}, D=${scoreD}.`,
  };
}

export function evaluateRula(posture: RulaPosture, sideMode: EvaluationSide): RulaEvaluationResult {
  const sides: BodySide[] = sideMode === 'both' ? ['left', 'right'] : [sideMode];
  const results = sides.map((side) => evaluateRulaSide(posture, side));
  const worst = results.reduce((max, current) => current.finalScore > max.finalScore ? current : max, results[0]);
  return { sideMode, results, worstSide: worst.side, worstScore: worst.finalScore };
}

export function getSegmentPreview(posture: RulaPosture, side: BodySide, key: string): SegmentScore | undefined {
  return evaluateRulaSide(posture, side).segments.find((segment) => segment.key === key);
}
