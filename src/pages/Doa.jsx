import { useAmalStore } from '../store/amalStore.js';
import { DUAS_100 } from '../data/amalData.js';

export function Doa() {
  const toggleTask = useAmalStore(s => s.toggleTask);
  const doneLogs   = useAmalStore(s => s.logs[s.selectedDate] ?? {});
  const doneCount  = DUAS_100.reduce((acc, _, i) => acc + (doneLogs[`dua_${i + 1}`] === 'done' ? 1 : 0), 0);

  return (
    <>
      <p className="section-title">১০০টি দোয়ার তালিকা</p>
      <div style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 12 }}>
        টিক দিয়ে ট্র্যাক করুন &nbsp;
        <span style={{ fontWeight: 600, color: 'var(--green)' }}>{doneCount}/{DUAS_100.length}</span>
      </div>
      <div className="card">
        {DUAS_100.map((dua, i) => {
          const id   = `dua_${i + 1}`;
          const done = doneLogs[id] === 'done';
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
