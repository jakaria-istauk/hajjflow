import { useAmalStore } from '../store/amalStore.js';
import { DUAS_100 } from '../data/amalData.js';

export function Doa() {
  const toggleTask = useAmalStore(s => s.toggleTask);
  const isTaskDone = useAmalStore(s => s.isTaskDone);

  return (
    <>
      <p className="section-title">১০০টি দোয়ার তালিকা</p>
      <div style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 12 }}>টিক দিয়ে ট্র্যাক করুন</div>
      <div className="card">
        {DUAS_100.map((dua, i) => {
          const id   = `dua_${i + 1}`;
          const done = isTaskDone(id);
          return (
            <div className="doa-item" key={id}>
              <div className="doa-num">{i + 1}.</div>
              <div className={`doa-text${done ? ' done' : ''}`}>{dua}</div>
              <div
                className={`doa-check${done ? ' done' : ''}`}
                onClick={() => toggleTask(id)}
                role="checkbox"
                aria-checked={done}
                tabIndex={0}
                onKeyDown={e => e.key === ' ' && toggleTask(id)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
