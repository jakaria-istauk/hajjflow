import { useAmalStore } from '../store/amalStore.js';

export function AmalRow({ task, checkClass = 'check' }) {
  const toggleTask = useAmalStore(s => s.toggleTask);
  const isTaskDone = useAmalStore(s => s.isTaskDone);
  const done = isTaskDone(task.id);

  return (
    <div className="amal-row">
      <div
        className={`${checkClass}${done ? ' done' : ''}`}
        onClick={() => toggleTask(task.id)}
        role="checkbox"
        aria-checked={done}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && toggleTask(task.id)}
      />
      <div className={`amal-text${done ? ' done' : ''}`}>{task.label}</div>
    </div>
  );
}
