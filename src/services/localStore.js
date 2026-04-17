const KEY      = 'hajjflow_local_logs';
const MAX_DAYS = 30;

export function getLocalLogs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLocalLog(date) {
  return getLocalLogs()[date] ?? {};
}

export function setLocalLog(date, tasks) {
  const logs    = getLocalLogs();
  logs[date]    = tasks;
  _persist(logs);
}

export function clearLocalLogs() {
  localStorage.removeItem(KEY);
}

export function hasAnyDone(logs) {
  return Object.values(logs).some(day =>
    Object.values(day).some(v => v === 'done')
  );
}

// ── FIFO cleanup ───────────────────────────────────────────────────────────
// ISO date strings sort lexicographically == chronologically.
// Evicts oldest date(s) until ≤ MAX_DAYS remain.
function _cleanup(logs) {
  const dates = Object.keys(logs).sort();
  while (dates.length > MAX_DAYS) {
    delete logs[dates.shift()];
  }
  return logs;
}

function _persist(logs) {
  localStorage.setItem(KEY, JSON.stringify(_cleanup(logs)));
}
