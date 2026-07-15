import type { ErgonomicTask } from '../types/rula';

interface Props { tasks: ErgonomicTask[]; currentId: string; onLoad: (task: ErgonomicTask) => void; onSave: () => void; onNew: () => void; onCloneAfter: () => void; }

export default function TaskLibrary({ tasks, currentId, onLoad, onSave, onNew, onCloneAfter }: Props) {
  return <section className="panel library-panel"><div className="section-title"><p>Biblioteca de tareas</p><h2>Guardar, cargar y comparar</h2></div><div className="button-row"><button className="primary" onClick={onSave}>Guardar tarea</button><button className="soft" onClick={onNew}>Nueva</button><button className="soft" onClick={onCloneAfter}>Clonar antes → después</button></div><div className="task-list">{tasks.length === 0 && <small>No hay tareas guardadas aún.</small>}{tasks.map((task)=><button key={task.id} className={task.id === currentId ? 'task active' : 'task'} onClick={()=>onLoad(task)}><strong>{task.name}</strong><span>{new Date(task.updatedAt).toLocaleString()}</span></button>)}</div></section>;
}
