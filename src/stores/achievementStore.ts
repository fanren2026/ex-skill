import { create } from 'zustand';
import type { Achievement } from '../types';
import { achievementService } from '../services/mockServices';

interface AchievementStore {
  achievements: Achievement[];
  isLoading: boolean;
  fetchAchievements: () => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<Achievement | null>;
}

export const useAchievementStore = create<AchievementStore>((set) => ({
  achievements: [],
  isLoading: false,

  fetchAchievements: async () => {
    set({ isLoading: true });
    try {
      const achievements = await achievementService.getAchievements();
      set({ achievements, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  unlockAchievement: async (achievementId: string) => {
    try {
      const achievement = await achievementService.unlockAchievement(achievementId);
      if (achievement) {
        set(state => ({
          achievements: state.achievements.map(a =>
            a.id === achievementId ? { ...a, unlockedAt: achievement.unlockedAt } : a
          ),
        }));
      }
      return achievement;
    } catch {
      return null;
    }
  },
}));
