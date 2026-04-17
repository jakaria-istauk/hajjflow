import api from './api.js';

export const amalService = {
  // GET /logs?date=YYYY-MM-DD
  async getLogsForDate(date) {
    const { data } = await api.get('/logs', { params: { date } });
    return data.tasks ?? {};
  },

  // GET /logs  (full history)
  async getAllLogs() {
    const { data } = await api.get('/logs');
    return data.logs ?? {};
  },

  // POST /update-log  — single task toggle
  async updateTask(date, taskId, status) {
    const { data } = await api.post('/update-log', { date, task_id: taskId, status });
    return data.success;
  },

  // POST /update-log  — full day bulk save
  async bulkUpdateDate(date, tasks) {
    const { data } = await api.post('/update-log', { date, tasks });
    return data.success;
  },

  // GET /me
  async getMe() {
    const { data } = await api.get('/me');
    return data;
  },

  // POST /auth/google — exchange Google id_token for JWT
  async googleAuth(idToken) {
    const { data } = await api.post('/auth/google', { id_token: idToken });
    return data; // { token, user_id, name, email, picture }
  },
};
