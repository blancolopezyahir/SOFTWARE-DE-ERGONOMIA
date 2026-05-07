import { jsiFactorOrder, jsiFactors } from '../config/jsiConfig';
import type { ErgonomicTask, JsiResult } from '../types/ergonomics';

export function JsiPanel({
  task,
  result,
  onTaskChange,
  onSave,
  onExport,
  onCreateAfter
}: {
  task: ErgonomicTask;
  result: JsiResult;
  onTaskChange: (task: ErgonomicTask) => void;
  onSave: () => void;
  onExport: () => void;
  onCreateAfter: () => void;
}) {
  return (
    <section className="panel jsi-panel">
      <div className="panel-header">
        <h2>Tarea ergonómica + JSI</h2>
        <span>{task.scenario === 'antes' ? 'Antes' : 'Después'}</span>
      </div>
      <label className="field">
        Nombre de la tarea
        <input value={task.name} onChange={(event) => onTaskChange({ ...task, name: event.target.value })} />
      </label>
      <label className="field">
        Descripción
        <textarea value={task.description} onChange={(event) => onTaskChange({ ...task, description: event.target.value })} />
      </label>
      <div className="factor-grid">
        {jsiFactorOrder.map((key) => (
          <label key={key} className="field">
            {jsiFactors[key].label}
            <small>{jsiFactors[key].unitHint}</small>
            <select value={task.jsi[key]} onChange={(event) => onTaskChange({ ...task, jsi: { ...task.jsi, [key]: event.target.value } })}>
              {jsiFactors[key].options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} · multiplicador {option.multiplier}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="jsi-result" style={{ borderColor: result.color }}>
        <span>Índice JSI</span>
        <strong style={{ color: result.color }}>{result.score.toFixed(2)}</strong>
        <em>{result.label}</em>
      </div>
      <div>
        <h3>Factores con mayor impacto</h3>
        <ul className="impact-list">
          {result.impacts.map((impact) => (
            <li key={impact.key}>
              <strong>{impact.label}</strong>: {impact.optionLabel} (x{impact.multiplier})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Recomendaciones JSI</h3>
        <ul className="recommendations">
          {result.recommendations.map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      </div>
      <div className="actions">
        <button onClick={onSave}>Guardar tarea</button>
        <button className="secondary" onClick={onCreateAfter}>Crear “después”</button>
        <button className="secondary" onClick={onExport}>Exportar resumen JSON</button>
      </div>
    </section>
  );
}
