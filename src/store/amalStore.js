import { create } from 'zustand';
import { amalService } from '../services/amalService.js';
import { todayStr } from '../data/amalData.js';

export const useAmalStore = create((set, get) => ({
  logs: {},           // { 'YYYY-MM-DD': { task_id: 'done'|'pending' } }
  selectedDate: todayStr(),
  syncing: false,
  historyLoaded: false,

  setSelectedDate: (date) => set({ selectedDate: date }),

  // Current date's tasks
  todayLogs: () => get().logs[get().selectedDate] ?? {},

  // Fetch single date from server (or use cached)
  fetchDate: async (date) => {
    const existing = get().logs[date];
    if (existing) return;
    try {
      const tasks = await amalService.getLogsForDate(date);
      set(s => ({ logs: { ...s.logs, [date]: tasks } }));
    } catch {
      // offline fallback — keep empty
    }
  },

  // Fetch full history
  fetchAllLogs: async () => {
    if (get().historyLoaded) return;
    try {
      const all = await amalService.getAllLogs();
      set(s => ({ logs: { ...s.logs, ...all }, historyLoaded: true }));
    } catch {
      // silent fail
    }
  },

  // Toggle a task and sync to server
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
    const date = get().selectedDate;
    const dayLog = get().logs[date] ?? {};
    const done = taskList.filter(t => dayLog[t.id] === 'done').length;
    return { done, total: taskList.length };
  },
}));
