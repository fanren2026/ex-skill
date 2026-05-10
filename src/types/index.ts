export type Language = 'en' | 'ja' | 'ko';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LessonType = 'vocabulary' | 'grammar' | 'speaking' | 'listening';

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  targetLanguage: Language;
  currentLevel: Level;
  joinDate: string;
  totalXp: number;
  streak: number;
}

export interface Course {
  id: string;
  language: Language;
  level: Level;
  title: string;
  description: string;
  lessons: Lesson[];
  thumbnail: string;
  lessonCount: number;
  estimatedHours: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  completed: boolean;
  xpReward: number;
  content?: VocabularyItem[] | GrammarItem[] | SpeakingItem[] | ListeningItem[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
}

export interface GrammarItem {
  id: string;
  rule: string;
  explanation: string;
  examples: { original: string; translated: string }[];
}

export interface SpeakingItem {
  id: string;
  prompt: string;
  translation: string;
  audioUrl?: string;
}

export interface ListeningItem {
  id: string;
  title: string;
  transcript: string;
  translation: string;
  audioUrl?: string;
}

export interface AbilityScores {
  vocabulary: number;
  grammar: number;
  speaking: number;
  listening: number;
}

export interface LearningProgress {
  userId: string;
  language: Language;
  vocabularyMastered: number;
  grammarCompleted: number;
  speakingMinutes: number;
  listeningHours: number;
  weeklyGoal: number;
  weeklyAchieved: number;
  studyCalendar: Record<string, boolean>;
  abilityScores: AbilityScores;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  language: Language;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  requirement: number;
  category: 'streak' | 'lesson' | 'vocabulary' | 'social' | 'milestone';
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}
