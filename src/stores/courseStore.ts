import { create } from 'zustand';
import type { Language, Level, Course, Lesson, LanguageInfo } from '../types';
import { courseService } from '../services/mockServices';

interface CourseStore {
  languages: LanguageInfo[];
  selectedLanguage: Language;
  selectedLevel: Level;
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  selectLanguage: (lang: Language) => void;
  selectLevel: (level: Level) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  fetchCourses: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  languages: courseService.getLanguages(),
  selectedLanguage: 'en',
  selectedLevel: 'A1',
  courses: [],
  currentCourse: null,
  currentLesson: null,

  selectLanguage: (lang: Language) => {
    set({ selectedLanguage: lang });
    get().fetchCourses();
  },

  selectLevel: (level: Level) => {
    set({ selectedLevel: level });
  },

  setCurrentCourse: (course: Course | null) => {
    set({ currentCourse: course });
  },

  setCurrentLesson: (lesson: Lesson | null) => {
    set({ currentLesson: lesson });
  },

  fetchCourses: () => {
    const courses = courseService.getCoursesByLanguage(get().selectedLanguage);
    set({ courses });
  },
}));
