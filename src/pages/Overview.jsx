import { useEffect, useState } from 'react';
import { AmalRow }    from '../components/AmalRow.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAmalStore } from '../store/amalStore.js';
import { DAILY_CORE, HAJJ_STEPS, todayStr } from '../data/amalData.js';

const BN = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
function toBn(n) {
  return String(n).split('').map(d => BN[parseInt(d, 10)] ?? d).join('');
}
function getTawafCount() {
  return parseInt(localStorage.getItem('hajjflow_tawaf_count') || '0', 10);
}

export function Overview({ onNavigate }) {
  const fetchDate = useAmalStore(s => s.fetchDate);
  const getStats  = useAmalStore(s => s.getStats);
  const setDate   = useAmalStore(s => s.setSelectedDate);
  const [stepsOpen,  setStepsOpen]  = useState(false);
  const [tawafTotal] = useState(getTawafCount);

  useEffect(() => {
    setDate(todayStr());
    fetchDate(todayStr());
  }, []);

  const coreStats = getStats(DAILY_CORE);
  const stepStats = getStats(HAJJ_STEPS);

  return (
    <>
      <div className="stats">
        <div className="stat-card">
          <div className="stat-num">{coreStats.done}</div>
          <div className="stat-label">আমল সম্পন্ন</div>
          <ProgressBar done={coreStats.done} total={coreStats.total} />
        </div>
        <div className="stat-card">
          <div className="stat-num">{stepStats.done}</div>
          <div className="stat-label">হজ্ব ধাপ সম্পন্ন</div>
          <ProgressBar done={stepStats.done} total={stepStats.total} />
        </div>
      </div>

      {/* ── Tawaf Progress Link ───────────────────────────────────────── */}
      <button className="tawaf-overview-card" onClick={() => onNavigate?.('tawaf')}>
        <div className="tawaf-ov-left">
          <span className="tawaf-ov-icon">🔄</span>
          <div>
            <div className="tawaf-ov-title">তাওয়াফ ট্র্যাকার</div>
            <div className="tawaf-ov-sub">
              {tawafTotal > 0
                ? `সম্পন্ন: ${toBn(tawafTotal)} তাওয়াফ`
                : 'এখনো তাওয়াফ শুরু হয়নি'}
            </div>
          </div>
        </div>
        <span className="tawaf-ov-arrow">›</span>
      </button>

      {/* ── Daily Amal ───────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-title">আজকের মূল আমল</div>
        {DAILY_CORE.map(task => <AmalRow key={task.id} task={task} />)}
      </div>

      {/* ── Hajj Steps Accordion ─────────────────────────────────────── */}
      <div className="card">
        <button
          className="accordion-header"
          onClick={() => setStepsOpen(o => !o)}
          aria-expanded={stepsOpen}
        >
          <span className="card-title" style={{ marginBottom: 0 }}>হজ্বের ধাপসমূহ</span>
          <div className="accordion-meta">
            <span className="accordion-progress">{stepStats.done}/{stepStats.total}</span>
            <span className={`accordion-chevron${stepsOpen ? ' open' : ''}`}>›</span>
          </div>
        </button>
        {stepsOpen && (
          <div className="accordion-body">
            {HAJJ_STEPS.map(task => <AmalRow key={task.id} task={task} />)}
          </div>
        )}
      </div>
    </>
  );
}
