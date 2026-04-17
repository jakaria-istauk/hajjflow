import { useEffect } from 'react';
import { AmalRow } from '../components/AmalRow.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAmalStore } from '../store/amalStore.js';
import { DAILY_CORE, AMAL_CHART_TASKS } from '../data/amalData.js';

const ALL_TASKS = [...DAILY_CORE, ...AMAL_CHART_TASKS];

function prevDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function nextDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function History() {
  const selectedDate   = useAmalStore(s => s.selectedDate);
  const setDate        = useAmalStore(s => s.setSelectedDate);
  const fetchDate      = useAmalStore(s => s.fetchDate);
  const fetchAllLogs   = useAmalStore(s => s.fetchAllLogs);
  const getStats       = useAmalStore(s => s.getStats);

  useEffect(() => {
    fetchAllLogs();
  }, []);

  useEffect(() => {
    fetchDate(selectedDate);
  }, [selectedDate]);

  const { done, total } = getStats(ALL_TASKS);
  const today = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === today;

  return (
    <>
      <p className="section-title">আমলের ইতিহাস</p>

      <div className="history-date-nav">
        <button onClick={() => setDate(prevDay(selectedDate))} aria-label="আগের দিন">‹</button>
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={e => setDate(e.target.value)}
        />
        <button
          onClick={() => setDate(nextDay(selectedDate))}
          disabled={isToday}
          aria-label="পরের দিন"
          style={{ opacity: isToday ? 0.4 : 1 }}
        >›</button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">{selectedDate} — সারসংক্ষেপ</div>
        <div className="stat-num" style={{ fontSize: 28 }}>{done}<span style={{ fontSize: 14, color: 'var(--text-sec)', fontWeight: 400 }}>/{total}</span></div>
        <ProgressBar done={done} total={total} label={`${Math.round((done/total)*100) || 0}% সম্পন্ন`} />
      </div>

      <div className="card">
        <div className="card-title">দৈনিক আমল</div>
        {DAILY_CORE.map(task => <AmalRow key={task.id} task={task} />)}
      </div>

      <div className="card">
        <div className="card-title">অতিরিক্ত আমল</div>
        {AMAL_CHART_TASKS.map(task => <AmalRow key={task.id} task={task} />)}
      </div>
    </>
  );
}
