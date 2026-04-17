import { useEffect } from 'react';
import { AmalRow } from '../components/AmalRow.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAmalStore } from '../store/amalStore.js';
import { DAILY_CORE, HAJJ_STEPS, todayStr } from '../data/amalData.js';

export function Overview() {
  const fetchDate  = useAmalStore(s => s.fetchDate);
  const getStats   = useAmalStore(s => s.getStats);
  const setDate    = useAmalStore(s => s.setSelectedDate);

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

      <div className="card">
        <div className="card-title">আজকের মূল আমল</div>
        {DAILY_CORE.map(task => <AmalRow key={task.id} task={task} />)}
      </div>

      <div className="card">
        <div className="card-title">হজ্বের ধাপসমূহ</div>
        {HAJJ_STEPS.map(task => <AmalRow key={task.id} task={task} />)}
      </div>
    </>
  );
}
