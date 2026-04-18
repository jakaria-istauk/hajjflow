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
  const fetchDate  = useAmalStore(s => s.fetchDate);
  const setDate    = useAmalStore(s => s.setSelectedDate);
  const coreStats  = useAmalStore(s => {
    const dayLog = s.logs[s.selectedDate] ?? {};
    return { done: DAILY_CORE.filter(t => dayLog[t.id] === 'done').length, total: DAILY_CORE.length };
  });
  const stepStats  = useAmalStore(s => {
    const dayLog = s.logs[s.selectedDate] ?? {};
    return { done: HAJJ_STEPS.filter(t => dayLog[t.id] === 'done').length, total: HAJJ_STEPS.length };
  });
  const [stepsOpen,  setStepsOpen]  = useState(false);
  const [tawafTotal] = useState(getTawafCount);
  const [alertOpen,  setAlertOpen]  = useState(false);

  useEffect(() => {
    setDate(todayStr());
    fetchDate(todayStr());
  }, []);

  return (
    <>
      <button className="scholar-notice-bar" onClick={() => setAlertOpen(true)}>
        <span className="scholar-notice-icon">⚠️</span>
        <span className="scholar-notice-label">ফরজ, ওয়াজিব ও সুন্নাহ বিষয়ে সতর্কতা</span>
        <span className="scholar-notice-arrow">›</span>
      </button>

      {alertOpen && (
        <div className="modal-overlay" onClick={() => setAlertOpen(false)}>
          <div className="modal-card scholar-modal" onClick={e => e.stopPropagation()}>
            <div className="scholar-modal-icon">⚠️</div>
            <div className="scholar-modal-title">গুরুত্বপূর্ণ সতর্কতা</div>
            <p className="scholar-modal-body">
              এই অ্যাপটি শুধুমাত্র হজ্বের একটি <strong>সংক্ষিপ্ত সারসংক্ষেপ</strong>।
              যেকোনো <strong>ফরজ</strong>, <strong>ওয়াজিব</strong> ও <strong>সুন্নাহ</strong> বিষয়ে
              সিদ্ধান্ত নেওয়ার আগে অবশ্যই একজন যোগ্য <strong>আলেম বা মুফতির</strong> পরামর্শ গ্রহণ করুন।
              ভুল আমলে হজ্ব ক্ষতিগ্রস্ত হতে পারে।
            </p>
            <button className="scholar-modal-close" onClick={() => setAlertOpen(false)}>বুঝেছি</button>
          </div>
        </div>
      )}

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
