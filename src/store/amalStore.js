import { create } from 'zustand';
import { amalService } from '../services/amalService.js';
import { todayStr } from '../data/amalData.js';
import {
  getLocalLogs,
  getLocalLog,
  setLocalLog,
  clearLocalLogs,
} from '../services/localStore.js';

// Pre-hydrate guest logs without importing authStore (avoids circular dep).
const _isGuest    = !localStorage.getItem('hajjflow_jwt');
const _initialLogs = _isGuest ? getLocalLogs() : {};

export const useAmalStore = create((set, get) => ({
  logs:            _initialLogs,
  selectedDate:    todayStr(),
  syncing:         false,
  historyLoaded:   false,
  showSyncPrompt:  false,   // flip to true on first guest toggle

  setSelectedDate: (date) => set({ selectedDate: date }),

  // Current date's tasks
  todayLogs: () => get().logs[get().selectedDate] ?? {},

  // ── Fetch single date ─────────────────────────────────────────────────────
  fetchDate: async (date) => {
    const existing = get().logs[date];
    if (existing) return;

    const jwt = localStorage.getItem('hajjflow_jwt');
    if (!jwt) {
      const local = getLocalLog(date);
      if (Object.keys(local).length > 0) {
        set(s => ({ logs: { ...s.logs, [date]: local } }));
      }
      return;
    }

    try {
      const tasks = await amalService.getLogsForDate(date);
      set(s => ({ logs: { ...s.logs, [date]: tasks } }));
    } catch {
      // offline fallback — keep empty
    }
  },

  // ── Fetch full history ────────────────────────────────────────────────────
  fetchAllLogs: async () => {
    if (get().historyLoaded) return;

    const jwt = localStorage.getItem('hajjflow_jwt');
    if (!jwt) {
      const local = getLocalLogs();
      set(s => ({ logs: { ...s.logs, ...local }, historyLoaded: true }));
      return;
    }

    try {
      const all = await amalService.getAllLogs();
      set(s => ({ logs: { ...s.logs, ...all }, historyLoaded: true }));
    } catch {
      // silent fail
    }
  },

  // ── Toggle task — guest writes localStorage, auth hits API ───────────────
  toggleTask: async (taskId) => {
    const date    = get().selectedDate;
    const current = get().logs[date]?.[taskId] ?? 'pending';
    const next    = current === 'done' ? 'pending' : 'done';

    // Optimistic update
    set(s => ({
      logs: {
        ...s.logs,
        [date]: { ...(s.logs[date] ?? {}), [taskId]: next },
      },
    }));

    const jwt = localStorage.getItem('hajjflow_jwt');
    if (!jwt) {
      // Guest: persist to localStorage + show sync prompt
      setLocalLog(date, get().logs[date]);
      set({ showSyncPrompt: true });
      return;
    }

    set({ syncing: true });
    try {
      await amalService.updateTask(date, taskId, next);
    } catch {
      // Revert on failure
      set(s => ({
        logs: {
          ...s.logs,
          [date]: { ...(s.logs[date] ?? {}), [taskId]: current },
        },
      }));
    } finally {
      set({ syncing: false });
    }
  },

  isTaskDone: (taskId) => {
    const date = get().selectedDate;
    return get().logs[date]?.[taskId] === 'done';
  },

  // Stats for overview
  getStats: (taskList) => {
    const date   = get().selectedDate;
    const dayLog = get().logs[date] ?? {};
    const done   = taskList.filter(t => dayLog[t.id] === 'done').length;
    return { done, total: taskList.length };
  },

  // ── Post-login: lift localStorage → server, replace store with server data ─
  liftLocalToRemote: async () => {
    const local = getLocalLogs();
    if (Object.keys(local).length === 0) {
      set({ showSyncPrompt: false });
      return;
    }

    try {
      await amalService.syncLocalData(local);
      clearLocalLogs();
      // Re-fetch merged data from server
      const all = await amalService.getAllLogs();
      set({ logs: all, historyLoaded: true, showSyncPrompt: false });
    } catch {
      // Sync failed — keep localStorage intact, don't clear
    }
  },
}));
