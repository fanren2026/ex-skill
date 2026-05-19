import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseProgress, Weakness } from '../types';
interface AppState {
 userId: string;
 sessionStarted: Date;
 progress: Record<string, CourseProgress>;
 weaknesses: Weakness[];
 earnedBadges: string[];
 preferredCategories: string[];
 skillLevel: 'beginner' | 'intermediate' | 'advanced';
 activeTab: string;
 sidebarOpen: boolean;
 setProgress: (courseId: string, progress: number, completedModules: string[]) => void;
 addWeakness: (weakness: Weakness) => void;
 removeWeakness: (moduleId: string) => void;
 earnBadge: (badgeId: string) => void;
 setPreferredCategories: (categories: string[]) => void;
 setSkillLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
 setActiveTab: (tab: string) => void;
 toggleSidebar: () => void;
 clearAllProgress: () => void;
}
const generateUserId = () => {
 const existing = localStorage.getItem('skill-distill-user-id');
 if (existing)
 return existing;
 const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
 localStorage.setItem('skill-distill-user-id', newId);
 return newId;
};
export const useAppStore = create<AppState>()(persist((set) => ({
 userId: generateUserId(),
 sessionStarted: new Date(),
 progress: {},
 weaknesses: [],
 earnedBadges: [],
 preferredCategories: [],
 skillLevel: 'beginner',
 activeTab: 'home',
 sidebarOpen: false,
 setProgress: (courseId, progress, completedModules) => set((state) => ({
 progress: {
 ...state.progress,
 [courseId]: {
 courseId,
 progress,
 completedModules,
 lastAccessed: new Date()
 }
 }
 })),
 addWeakness: (weakness) => set((state) => ({
 weaknesses: [...state.weaknesses, weakness]
 })),
 removeWeakness: (moduleId) => set((state) => ({
 weaknesses: state.weaknesses.filter(w => w.moduleId !== moduleId)
 })),
 earnBadge: (badgeId) => set((state) => {
 if (state.earnedBadges.includes(badgeId))
 return state;
 return { earnedBadges: [...state.earnedBadges, badgeId] };
 }),
 setPreferredCategories: (categories) => set({ preferredCategories: categories }),
 setSkillLevel: (level) => set({ skillLevel: level }),
 setActiveTab: (tab) => set({ activeTab: tab }),
 toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
 clearAllProgress: () => set({
 progress: {},
 weaknesses: [],
 earnedBadges: [],
 preferredCategories: []
 })
}), {
 name: 'skill-distill-storage',
}));
