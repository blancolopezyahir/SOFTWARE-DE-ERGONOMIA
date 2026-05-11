import type { ErgonomicTask } from '../types/ergonomics';

export function TaskLibrary({
  tasks,
  selectedTaskId,
  onLoad,
  onDelete,
  comparison
}: {
  tasks: ErgonomicTask[];
  selectedTaskId: string;
  onLoad: (task: ErgonomicTask) => void;
  onDelete: (taskId: string) => void;
  comparison?: { before: number; after: number; delta: number };
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Tareas guardadas</h2>
        <span>localStorage JSON</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className={task.id === selectedTaskId ? 'task-card active' : 'task-card'}>
            <button onClick={() => onLoad(task)}>
              <strong>{task.name}</strong>
              <span>{task.scenario} · {task.postureName}</span>
            </button>
            {!task.id.startsWith('ejemplo-') && (
              <button className="icon" onClick={() => onDelete(task.id)} aria-label={`Eliminar ${task.name}`}>×</button>
            )}
          </article>
        ))}
      </div>
      {comparison && (
        <div className="comparison">
          <h3>Comparación antes / después</h3>
          <p>Antes: <strong>{comparison.before.toFixed(2)}</strong></p>
          <p>Después: <strong>{comparison.after.toFixed(2)}</strong></p>
          <p>Mejora: <strong>{comparison.delta.toFixed(2)}</strong> puntos JSI</p>
        </div>
      )}
    </section>
  );
}
