export type JointKey =
  | 'neck'
  | 'trunk'
  | 'shoulder'
  | 'elbow'
  | 'wrist'
  | 'hip'
  | 'knee'
  | 'ankle';

export type Posture = Record<JointKey, number>;

export type PostureName = 'escritorio' | 'levantamiento' | 'alcance';

export type RiskLevel = 'low' | 'medium' | 'high';

export type JsiFactorKey =
  | 'intensity'
  | 'duration'
  | 'effortsPerMinute'
  | 'handWristPosture'
  | 'speedOfWork'
  | 'taskDurationPerDay';

export type JsiClassification = 'safe' | 'review' | 'dangerous';

export interface JsiOption {
  id: string;
  label: string;
  description: string;
  multiplier: number;
}

export interface JsiFactorConfig {
  label: string;
  shortLabel: string;
  unitHint: string;
  options: JsiOption[];
}

export type JsiSelections = Record<JsiFactorKey, string>;

export interface ErgonomicTask {
  id: string;
  name: string;
  description: string;
  postureName: PostureName | 'personalizada';
  posture: Posture;
  jsi: JsiSelections;
  scenario: 'antes' | 'despues';
  pairedWith?: string;
  updatedAt: string;
}

export interface JsiFactorImpact {
  key: JsiFactorKey;
  label: string;
  optionLabel: string;
  multiplier: number;
  recommendation: string;
}

export interface JsiResult {
  score: number;
  classification: JsiClassification;
  label: string;
  color: string;
  impacts: JsiFactorImpact[];
  recommendations: string[];
}
