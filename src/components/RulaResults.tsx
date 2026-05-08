import { evaluateRula } from '../utils/rula';
import type { EvaluationSide, RulaPosture } from '../types/rula';

interface Props { posture: RulaPosture; sideMode: EvaluationSide; title?: string; compact?: boolean; onExport?: () => void; }

export default function RulaResults({ posture, sideMode, title='Resultado RULA', compact=false, onExport }: Props) {
  const evaluation = evaluateRula(posture, sideMode);
  return <section className="panel results-panel">
    <div className="section-title row"><div><p>Panel de evaluación RULA</p><h2>{title}</h2></div>{onExport && <button className="primary" onClick={onExport}>Exportar JSON</button>}</div>
    <div className="result-cards">{evaluation.results.map((result) => <article key={result.side} className={`result-card ${evaluation.worstSide === result.side && evaluation.results.length > 1 ? 'worst' : ''}`} style={{ borderTopColor: result.color }}>
      <div className="score-circle" style={{ background: result.color }}>{result.finalScore}</div>
      <div><strong>{result.side === 'left' ? 'Lado izquierdo' : 'Lado derecho'} {evaluation.worstSide === result.side && evaluation.results.length > 1 ? '· mayor riesgo' : ''}</strong><h3>Nivel {result.actionLevel}: {result.actionLabel}</h3><p>{result.actionDescription}</p><small>{result.explanation}</small></div>
      <div className="mini-grid"><span>Grupo A <b>{result.groupA}</b></span><span>Grupo B <b>{result.groupB}</b></span><span>C <b>{result.scoreC}</b></span><span>D <b>{result.scoreD}</b></span></div>
      {!compact && <><h4>Detalle por segmentos</h4><div className="segment-list">{result.segments.map((segment) => <div key={segment.key} className="segment-row"><span>{segment.label}</span><b>{segment.score}</b><small>{segment.explanation} {segment.modifiers.join(', ')}</small></div>)}</div><h4>Segmentos que más elevan el riesgo</h4><div className="chips">{result.drivers.map((d)=><span key={d.key}>{d.label}: {d.score}</span>)}</div><h4>Recomendaciones automáticas</h4><ul>{result.recommendations.map((rec)=><li key={rec}>{rec}</li>)}</ul></>}
    </article>)}</div>
  </section>;
}
