import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '../services/mockServices';
import type { User, RegisterData } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: (error as Error).message || '登录失败', isLoading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: (error as Error).message || '注册失败', isLoading: false });
          return false;
        }
      },

      logout: () => {
        userService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateUser: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          set({ user: updatedUser });
          userService.updateProfile(currentUser.id, data);
        }
      },

      checkAuth: () => {
        const user = userService.getCurrentUser();
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'zhenxie-user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
