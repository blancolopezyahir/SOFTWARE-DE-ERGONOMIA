export type BodySide = 'left' | 'right';
export type EvaluationSide = BodySide | 'both';
export type ActivityType = 'dynamic' | 'static' | 'repetitive';
export type LoadType = 'under2Intermittent' | 'between2And10Intermittent' | 'between2And10Static' | 'over10Intermittent' | 'over10Static' | 'shock';
export type LegSupport = 'seatedSupported' | 'standingBalanced' | 'unsupportedOrUnbalanced';

export interface SidePosture {
  upperArmFlexion: number;
  shoulderRaised: boolean;
  upperArmAbducted: boolean;
  upperArmRotated: boolean;
  armSupported: boolean;
  lowerArmFlexion: number;
  lowerArmAcrossMidline: boolean;
  lowerArmOutToSide: boolean;
  wristFlexion: number;
  wristDeviation: boolean;
  wristTwist: 1 | 2;
}

export interface SharedPosture {
  neckFlexion: number;
  neckRotated: boolean;
  neckSideBent: boolean;
  trunkFlexion: number;
  trunkSeatedSupported: boolean;
  trunkRotated: boolean;
  trunkSideBent: boolean;
  legSupport: LegSupport;
  activity: ActivityType;
  load: LoadType;
}

export interface RulaPosture extends SharedPosture {
  left: SidePosture;
  right: SidePosture;
}

export interface ErgonomicTask {
  id: string;
  name: string;
  method: 'RULA';
  evaluatedSide: EvaluationSide;
  before: RulaPosture;
  after?: RulaPosture;
  updatedAt: string;
}

export interface SegmentScore {
  key: string;
  label: string;
  score: number;
  baseScore?: number;
  modifiers: string[];
  angle?: number;
  explanation: string;
}

export interface RulaSideResult {
  side: BodySide;
  finalScore: number;
  actionLevel: number;
  actionLabel: string;
  actionDescription: string;
  color: string;
  groupA: number;
  groupB: number;
  scoreC: number;
  scoreD: number;
  activityAdjustment: number;
  loadAdjustment: number;
  segments: SegmentScore[];
  drivers: SegmentScore[];
  recommendations: string[];
  explanation: string;
}

export interface RulaEvaluationResult {
  sideMode: EvaluationSide;
  results: RulaSideResult[];
  worstSide: BodySide;
  worstScore: number;
}
