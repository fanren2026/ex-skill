export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courses: SkillCourse[];
}

export interface SkillCourse {
  id: string;
  categoryId: string;
  name: string;
  level: 'basic' | 'advanced' | 'expert';
  description: string;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  courseId: string;
  type: 'knowledge' | 'case' | 'error' | 'practice';
  title: string;
  content: string;
  order: number;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedModules: string[];
  lastAccessed: Date;
}

export interface Weakness {
  courseId: string;
  moduleId: string;
  topic: string;
  confidence: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  likes: number;
  liked: boolean;
}

export interface AppState {
  userId: string;
  sessionStarted: Date;
  progress: Record<string, CourseProgress>;
  weaknesses: Weakness[];
  earnedBadges: string[];
  preferredCategories: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  activeTab: string;
  sidebarOpen: boolean;
}

export type LevelType = 'basic' | 'advanced' | 'expert';