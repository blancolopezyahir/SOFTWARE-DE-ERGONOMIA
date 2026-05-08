import { useMemo, useState } from 'react';
import HumanModel from './components/HumanModel';
import PostureControls from './components/PostureControls';
import RulaResults from './components/RulaResults';
import TaskLibrary from './components/TaskLibrary';
import type { BodySide, ErgonomicTask, EvaluationSide, RulaPosture } from './types/rula';
import { evaluateRula } from './utils/rula';
import { createTask, loadTasks, saveTasks } from './utils/tasks';
import './styles.css';

const clone = <T,>(value: T): T => structuredClone(value);

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-rula.json`; a.click(); URL.revokeObjectURL(url);
}

export default function App() {
  const [tasks, setTasks] = useState<ErgonomicTask[]>(() => loadTasks());
  const [task, setTask] = useState<ErgonomicTask>(() => loadTasks()[0] ?? createTask('Evaluación RULA demo'));
  const [phase, setPhase] = useState<'before' | 'after'>('before');
  const [activeSide, setActiveSide] = useState<BodySide>('right');
  const [activeKey, setActiveKey] = useState('general');
  const posture = task[phase] ?? task.before;
  const sideMode = task.evaluatedSide;
  const setPosture = (next: RulaPosture) => setTask((prev) => ({ ...prev, [phase]: next, updatedAt: new Date().toISOString() }));
  const beforeEval = useMemo(() => evaluateRula(task.before, sideMode), [task.before, sideMode]);
  const afterEval = useMemo(() => task.after ? evaluateRula(task.after, sideMode) : undefined, [task.after, sideMode]);
  const persistTask = () => { const updated = { ...task, updatedAt: new Date().toISOString() }; const next = [updated, ...tasks.filter((t)=>t.id !== updated.id)]; setTask(updated); setTasks(next); saveTasks(next); };
  const exportSummary = () => downloadJson(task.name, { task: task.name, evaluatedSide: sideMode, phase, posture, before: beforeEval, after: afterEval });

  return <main className="app-shell"><header className="hero"><div><span className="eyebrow">Ergonomía 3D · RULA</span><h1>Evaluador ergonómico Rapid Upper Limb Assessment</h1><p>App funcional React + TypeScript + Three.js para ajustar posturas, calcular RULA por lado corporal, comparar antes/después y exportar resultados.</p></div><div className="task-name"><label>Nombre de tarea<input value={task.name} onChange={(e)=>setTask({...task, name:e.target.value})} /></label><label>Lado evaluado<select value={task.evaluatedSide} onChange={(e)=>setTask({...task, evaluatedSide:e.target.value as EvaluationSide})}><option value="right">Derecho</option><option value="left">Izquierdo</option><option value="both">Ambos lados</option></select></label></div></header>
    <nav className="phase-tabs"><button className={phase==='before'?'selected':''} onClick={()=>setPhase('before')}>Postura antes · peor puntuación {beforeEval.worstScore}</button><button className={phase==='after'?'selected':''} onClick={()=>{ if(!task.after) setTask({...task, after: clone(task.before)}); setPhase('after'); }}>Postura después {afterEval ? `· peor puntuación ${afterEval.worstScore}` : '· crear comparación'}</button></nav>
    <div className="workspace"><section className="viewer-column"><HumanModel posture={posture} activeKey={activeKey} activeSide={activeSide} onResetFocus={()=>setActiveKey('general')} /><TaskLibrary tasks={tasks} currentId={task.id} onLoad={(t)=>{setTask(clone(t)); setPhase('before');}} onSave={persistTask} onNew={()=>{setTask(createTask()); setPhase('before');}} onCloneAfter={()=>{setTask({...task, after: clone(task.before)}); setPhase('after');}} /></section><PostureControls posture={posture} setPosture={setPosture} activeKey={activeKey} setActiveKey={setActiveKey} activeSide={activeSide} setActiveSide={setActiveSide} /><section className="right-column"><RulaResults posture={posture} sideMode={sideMode} title={`Resultado ${phase === 'before' ? 'antes' : 'después'}`} onExport={exportSummary} />{task.after && <RulaResults posture={phase === 'before' ? task.after : task.before} sideMode={sideMode} title={phase === 'before' ? 'Comparación: después' : 'Comparación: antes'} compact />}</section></div>
  </main>;
}
