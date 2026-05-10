import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectionService } from '../services/mockServices';
import type { Paper, DetectionReport, DetectionLevel, DailyDetection } from '../types';

interface DetectionState {
  currentPaper: Paper | null;
  currentReport: DetectionReport | null;
  reports: DetectionReport[];
  dailyDetections: DailyDetection[];
  isDetecting: boolean;
  progress: number;
  isLoading: boolean;
  error: string | null;

  submitPaper: (paper: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Paper>;
  startDetection: (paperId: string, level: DetectionLevel) => Promise<DetectionReport>;
  setProgress: (progress: number) => void;
  loadReports: (userId: string) => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
  loadDailyDetections: (userId: string, days?: number) => Promise<void>;
  generateCertificate: (reportId: string) => Promise<string>;
  reset: () => void;
  clearError: () => void;
}

export const useDetectionStore = create<DetectionState>()(
  persist(
    (set, get) => ({
      currentPaper: null,
      currentReport: null,
      reports: [],
      dailyDetections: [],
      isDetecting: false,
      progress: 0,
      isLoading: false,
      error: null,

      submitPaper: async (paperData) => {
        set({ isLoading: true, error: null });
        try {
          const paper = await detectionService.submitPaper(paperData);
          set({ currentPaper: paper, isLoading: false });
          return paper;
        } catch (error) {
          set({ error: (error as Error).message || '提交失败', isLoading: false });
          throw error;
        }
      },

      startDetection: async (paperId, level) => {
        set({ isDetecting: true, progress: 0, error: null });
        try {
          const progressInterval = setInterval(() => {
            const currentProgress = get().progress;
            if (currentProgress < 90) {
              set({ progress: currentProgress + 10 });
            }
          }, 300);

          const report = await detectionService.processDetection(paperId, level);

          clearInterval(progressInterval);
          set({ progress: 100, currentReport: report, isDetecting: false });

          const reports = get().reports;
          set({ reports: [report, ...reports] });

          return report;
        } catch (error) {
          set({ error: (error as Error).message || '检测失败', isDetecting: false });
          throw error;
        }
      },

      setProgress: (progress) => set({ progress }),

      loadReports: async (userId) => {
        set({ isLoading: true });
        try {
          const reports = await detectionService.getReports(userId);
          set({ reports, isLoading: false });
        } catch (error) {
          set({ error: '加载失败', isLoading: false });
        }
      },

      loadReport: async (reportId) => {
        set({ isLoading: true });
        try {
          const report = await detectionService.getReport(reportId);
          set({ currentReport: report, isLoading: false });
        } catch (error) {
          set({ error: '加载失败', isLoading: false });
        }
      },

      loadDailyDetections: async (userId, days = 30) => {
        try {
          const dailyDetections = await detectionService.getDailyDetections(userId, days);
          set({ dailyDetections });
        } catch (error) {
          set({ error: '加载失败' });
        }
      },

      generateCertificate: async (reportId) => {
        try {
          return await detectionService.generateCertificate(reportId);
        } catch (error) {
          set({ error: '生成失败' });
          throw error;
        }
      },

      reset: () => set({
        currentPaper: null,
        currentReport: null,
        isDetecting: false,
        progress: 0,
        error: null
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'zhenxie-detection-storage',
      partialize: (state) => ({
        reports: state.reports.slice(0, 50)
      })
    }
  )
);
