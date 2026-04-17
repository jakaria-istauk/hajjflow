import { useEffect } from 'react';
import { AmalRow } from '../components/AmalRow.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { useAmalStore } from '../store/amalStore.js';
import { AMAL_CHART_TASKS, todayStr } from '../data/amalData.js';

export function AmalChart() {
  const fetchDate = useAmalStore(s => s.fetchDate);
  const getStats  = useAmalStore(s => s.getStats);

  useEffect(() => { fetchDate(todayStr()); }, []);

  const { done, total } = getStats(AMAL_CHART_TASKS);

  return (
    <>
      <p className="section-title">দৈনিক আমল ট্র্যাকার</p>
      <div className="card">
        <div className="card-title">আমলের ধরন</div>
        <ProgressBar done={done} total={total} label={`${done}/${total} সম্পন্ন`} />
        <div style={{ marginTop: 12 }}>
          {AMAL_CHART_TASKS.map(task => <AmalRow key={task.id} task={task} />)}
        </div>
      </div>
    </>
  );
}
