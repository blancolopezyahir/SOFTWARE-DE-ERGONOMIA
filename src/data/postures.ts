import type { Posture, PostureName } from '../types/ergonomics';

export const neutralPosture: Posture = {
  neck: 0,
  trunk: 0,
  shoulder: 10,
  elbow: 90,
  wrist: 0,
  hip: 0,
  knee: 5,
  ankle: 0
};

export const predefinedPostures: Record<PostureName, Posture> = {
  escritorio: {
    neck: 18,
    trunk: 8,
    shoulder: 25,
    elbow: 95,
    wrist: 12,
    hip: 85,
    knee: 90,
    ankle: 0
  },
  levantamiento: {
    neck: 12,
    trunk: 45,
    shoulder: 35,
    elbow: 75,
    wrist: 18,
    hip: 55,
    knee: 65,
    ankle: 12
  },
  alcance: {
    neck: 10,
    trunk: 18,
    shoulder: 95,
    elbow: 35,
    wrist: 25,
    hip: 10,
    knee: 10,
    ankle: 5
  }
};

export const postureLabels: Record<PostureName, string> = {
  escritorio: 'Escritorio',
  levantamiento: 'Levantamiento',
  alcance: 'Alcance'
};
