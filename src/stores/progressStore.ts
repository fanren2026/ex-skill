import { create } from 'zustand';
import type { LearningProgress, AbilityScores } from '../types';
import { progressService } from '../services/mockServices';

interface ProgressStore {
  progress: LearningProgress | null;
  todayStudyMinutes: number;
  weeklyStreak: number;
  isLoading: boolean;
  fetchProgress: (userId: string) => Promise<void>;
  recordStudy: (userId: string, type: string, minutes: number) => Promise<void>;
  updateAbility: (userId: string, scores: Partial<AbilityScores>) => Promise<void>;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: null,
  todayStudyMinutes: 0,
  weeklyStreak: 0,
  isLoading: false,

  fetchProgress: async (userId: string) => {
    set({ isLoading: true });
    try {
      const progress = await progressService.fetchProgress(userId);
      const today = new Date().toISOString().split('T')[0];
      const streak = Object.keys(progress.studyCalendar).filter(date => {
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        return diff < 7;
      }).length;
      
      set({ 
        progress, 
        weeklyStreak: streak,
        todayStudyMinutes: progress.studyCalendar[today] ? 15 : 0,
        isLoading: false 
      });
    } catch {
      set({ isLoading: false });
    }
  },

  recordStudy: async (userId: string, type: string, minutes: number) => {
    try {
      const progress = await progressService.recordStudy(userId, type, minutes);
      const today = new Date().toISOString().split('T')[0];
      set(state => ({
        progress,
        todayStudyMinutes: state.todayStudyMinutes + minutes,
        weeklyStreak: progress.studyCalendar[today] ? state.weeklyStreak : state.weeklyStreak + 1,
      }));
    } catch {
      // Handle error silently
    }
  },

  updateAbility: async (userId: string, scores: Partial<AbilityScores>) => {
    try {
      const progress = await progressService.updateAbilityScores(userId, scores);
      set({ progress });
    } catch {
      // Handle error silently
    }
  },
}));
