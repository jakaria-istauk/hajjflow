import { create } from 'zustand';
import { amalService } from '../services/amalService.js';

const stored = localStorage.getItem('hajjflow_user');

export const useAuthStore = create((set) => ({
  user: stored ? JSON.parse(stored) : null,
  loading: false,
  error: null,

  loginWithGoogle: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const data = await amalService.googleAuth(idToken);
      localStorage.setItem('hajjflow_jwt', data.token);
      const user = { id: data.user_id, name: data.name, email: data.email, picture: data.picture };
      localStorage.setItem('hajjflow_user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Login failed', loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('hajjflow_jwt');
    localStorage.removeItem('hajjflow_user');
    set({ user: null, error: null });
  },
}));
