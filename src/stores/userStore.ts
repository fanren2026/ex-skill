import { create } from 'zustand';
import type { User } from '../types';
import { userService } from '../services/mockServices';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: userService.getCurrentUser(),
  isAuthenticated: !!userService.getCurrentUser(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  register: async (email: string, password: string, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.register(email, password, nickname);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    userService.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      set({ user: updatedUser });
      userService.updateProfile(data);
    }
  },

  clearError: () => set({ error: null }),
}));
