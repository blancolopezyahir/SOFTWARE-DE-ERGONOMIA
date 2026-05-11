import { useMemo, useState } from 'react';
import { ErgoScene, type CameraView } from './components/ErgoScene';
import { JsiPanel } from './components/JsiPanel';
import { PostureControls } from './components/PostureControls';
import { TaskLibrary } from './components/TaskLibrary';
import { exampleTasks } from './data/exampleTasks';
import { postureLabels, predefinedPostures } from './data/postures';
import { calculateJsi } from './utils/jsi';
import { evaluatePosture } from './utils/postureRisk';
import type { ErgonomicTask, JsiSelections, Posture, PostureName } from './types/ergonomics';
import './styles.css';

const STORAGE_KEY = 'ergonomia-jsi-tasks-v1';

const defaultJsi: JsiSelections = {
  intensity: 'somewhat-hard',
  duration: '10-29',
  effortsPerMinute: '4-8',
  handWristPosture: 'good',
  speedOfWork: 'fair',
  taskDurationPerDay: '2-4'
};

function loadStoredTasks(): ErgonomicTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ErgonomicTask[]) : [];
  } catch {
    return [];
  }
}

function createTask(posture: Posture = predefinedPostures.escritorio): ErgonomicTask {
  return {
    id: crypto.randomUUID(),
    name: 'Nueva tarea ergonómica',
    description: 'Describe la operación manual repetitiva que deseas evaluar.',
    postureName: 'personalizada',
    posture,
    scenario: 'antes',
    updatedAt: new Date().toISOString(),
    jsi: defaultJsi
  };
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [storedTasks, setStoredTasks] = useState<ErgonomicTask[]>(loadStoredTasks);
  const [currentTask, setCurrentTask] = useState<ErgonomicTask>(() => exampleTasks[0]);
  const [cameraView, setCameraView] = useState<CameraView>('free');

  const tasks = useMemo(() => {
    const storedIds = new Set(storedTasks.map((task) => task.id));
    return [...exampleTasks.filter((task) => !storedIds.has(task.id)), ...storedTasks];
  }, [storedTasks]);

  const postureRisk = useMemo(() => evaluatePosture(currentTask.posture), [currentTask.posture]);
  const jsiResult = useMemo(() => calculateJsi(currentTask.jsi), [currentTask.jsi]);

  const comparison = useMemo(() => {
    const pairId = currentTask.pairedWith;
    if (!pairId) return undefined;
    const paired = tasks.find((task) => task.id === pairId);
    if (!paired) return undefined;
    const beforeScore = calculateJsi(currentTask.scenario === 'antes' ? currentTask.jsi : paired.jsi).score;
    const afterScore = calculateJsi(currentTask.scenario === 'despues' ? currentTask.jsi : paired.jsi).score;
    return { before: beforeScore, after: afterScore, delta: beforeScore - afterScore };
  }, [currentTask, tasks]);

  function updateCurrentTask(task: ErgonomicTask) {
    setCurrentTask({ ...task, updatedAt: new Date().toISOString() });
  }

  function saveTask() {
    const taskToSave = { ...currentTask, updatedAt: new Date().toISOString() };
    const next = [...storedTasks.filter((task) => task.id !== taskToSave.id), taskToSave];
    setStoredTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCurrentTask(taskToSave);
  }

  function deleteTask(taskId: string) {
    const next = storedTasks.filter((task) => task.id !== taskId);
    setStoredTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (currentTask.id === taskId) setCurrentTask(exampleTasks[0]);
  }

  function applyPreset(name: PostureName) {
    updateCurrentTask({ ...currentTask, postureName: name, posture: predefinedPostures[name] });
  }

  function updatePosture(posture: Posture) {
    updateCurrentTask({ ...currentTask, postureName: 'personalizada', posture });
  }

  function createAfterScenario() {
    const afterTask: ErgonomicTask = {
      ...currentTask,
      id: crypto.randomUUID(),
      name: `${currentTask.name} · después`,
      scenario: 'despues',
      pairedWith: currentTask.id,
      updatedAt: new Date().toISOString(),
      posture: {
        ...currentTask.posture,
        neck: Math.max(0, currentTask.posture.neck - 10),
        trunk: Math.max(0, currentTask.posture.trunk - 15),
        shoulder: Math.max(10, currentTask.posture.shoulder - 25),
        wrist: Math.max(0, currentTask.posture.wrist - 12)
      },
      jsi: {
        ...currentTask.jsi,
        intensity: 'somewhat-hard',
        handWristPosture: 'good',
        speedOfWork: 'fair',
        taskDurationPerDay: '2-4'
      }
    };
    const linkedBefore = { ...currentTask, pairedWith: afterTask.id };
    const next = [...storedTasks.filter((task) => task.id !== linkedBefore.id), linkedBefore, afterTask];
    setStoredTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCurrentTask(afterTask);
  }

  function exportSummary() {
    downloadJson(`evaluacion-jsi-${currentTask.name.toLowerCase().replace(/\s+/g, '-')}.json`, {
      task: currentTask,
      postureRisk,
      jsiResult,
      comparison,
      exportedAt: new Date().toISOString()
    });
  }

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">MVP funcional · React + TypeScript + Vite + Three.js</p>
          <h1>Simulador humano 3D de ergonomía con Job Strain Index</h1>
          <p>
            Ajusta articulaciones, aplica posturas predefinidas, evalúa riesgo postural y calcula el JSI para tareas manuales repetitivas.
          </p>
        </div>
        <button onClick={() => setCurrentTask(createTask(currentTask.posture))}>Nueva tarea</button>
      </header>

      <section className="workspace">
        <div className="viewer-card">
          <div className="viewer-toolbar">
            <div>
              <strong>{currentTask.name}</strong>
              <span>Postura: {currentTask.postureName === 'personalizada' ? 'Personalizada' : postureLabels[currentTask.postureName]}</span>
            </div>
            <div className="view-buttons">
              <button className="secondary" onClick={() => setCameraView('front')}>Frontal</button>
              <button className="secondary" onClick={() => setCameraView('side')}>Lateral</button>
              <button className="secondary" onClick={() => setCameraView('top')}>Superior</button>
              <button className="secondary" onClick={() => setCameraView('free')}>Orbital</button>
            </div>
          </div>
          <div className="canvas-wrap">
            <ErgoScene posture={currentTask.posture} cameraView={cameraView} />
          </div>
          <div className={`risk-card ${postureRisk.level}`}>
            <div>
              <span>Semáforo postural</span>
              <strong>{postureRisk.label}</strong>
            </div>
            <em>Puntaje: {postureRisk.score.toFixed(1)}</em>
          </div>
          <ul className="recommendations compact">
            {postureRisk.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        </div>

        <div className="sidebars">
          <PostureControls posture={currentTask.posture} onPostureChange={updatePosture} onPreset={applyPreset} />
          <JsiPanel
            task={currentTask}
            result={jsiResult}
            onTaskChange={updateCurrentTask}
            onSave={saveTask}
            onExport={exportSummary}
            onCreateAfter={createAfterScenario}
          />
          <TaskLibrary
            tasks={tasks}
            selectedTaskId={currentTask.id}
            onLoad={setCurrentTask}
            onDelete={deleteTask}
            comparison={comparison}
          />
        </div>
      </section>
    </main>
  );
}
