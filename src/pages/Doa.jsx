import { useState } from 'react';
import { useAmalStore } from '../store/amalStore.js';
import { DUAS_100 } from '../data/amalData.js';

export function Doa() {
  const toggleTask  = useAmalStore(s => s.toggleTask);
  const doneLogs    = useAmalStore(s => s.logs[s.selectedDate] ?? {});
  const doneCount   = DUAS_100.reduce((acc, _, i) => acc + (doneLogs[`dua_${i + 1}`] === 'done' ? 1 : 0), 0);
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <p className="section-title">১০০টি দোয়ার তালিকা</p>
      <div style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>টিক দিয়ে ট্র্যাক করুন</span>
        <span className="doa-counter">{doneCount}/{DUAS_100.length}</span>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {DUAS_100.map(({ title, desc }, i) => {
          const id   = `dua_${i + 1}`;
          const done = doneLogs[id] === 'done';
          const open = openId === id;
          return (
            <div className={`doa-item-wrap${done ? ' done' : ''}`} key={id}>
              <div className="doa-item">
                <div className="doa-num">{i + 1}.</div>
                <button
                  className="doa-title-btn"
                  onClick={() => setOpenId(open ? null : id)}
                  aria-expanded={open}
                >
                  <span className={`doa-text${done ? ' done' : ''}`}>{title}</span>
                  <span className={`doa-chevron${open ? ' open' : ''}`}>›</span>
                </button>
                <div
                  className={`doa-check${done ? ' done' : ''}`}
                  onClick={() => toggleTask(id)}
                  role="checkbox"
                  aria-checked={done}
                  tabIndex={0}
                  onKeyDown={e => e.key === ' ' && toggleTask(id)}
                />
              </div>
              {open && (
                <div className="doa-desc">{desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
