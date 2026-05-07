import { jsiFactorOrder, jsiFactors, jsiRecommendations } from '../config/jsiConfig';
import type { JsiFactorImpact, JsiResult, JsiSelections } from '../types/ergonomics';

export function getMultiplier(factorKey: keyof JsiSelections, optionId: string): number {
  return jsiFactors[factorKey].options.find((option) => option.id === optionId)?.multiplier ?? 1;
}

export function calculateJsi(selections: JsiSelections): JsiResult {
  const impacts: JsiFactorImpact[] = jsiFactorOrder.map((key) => {
    const selected = jsiFactors[key].options.find((option) => option.id === selections[key]) ?? jsiFactors[key].options[0];
    return {
      key,
      label: jsiFactors[key].label,
      optionLabel: selected.label,
      multiplier: selected.multiplier,
      recommendation: jsiRecommendations[key]
    };
  });

  const score = impacts.reduce((product, factor) => product * factor.multiplier, 1);
  const classification = score < 3 ? 'safe' : score <= 7 ? 'review' : 'dangerous';
  const labels = {
    safe: 'Probablemente seguro',
    review: 'Requiere revisión / riesgo moderado',
    dangerous: 'Probablemente peligroso'
  } as const;
  const colors = {
    safe: '#22c55e',
    review: '#f59e0b',
    dangerous: '#ef4444'
  } as const;

  const criticalImpacts = [...impacts].sort((a, b) => b.multiplier - a.multiplier).slice(0, 3);

  return {
    score,
    classification,
    label: labels[classification],
    color: colors[classification],
    impacts: criticalImpacts,
    recommendations: criticalImpacts.map((impact) => impact.recommendation)
  };
}
