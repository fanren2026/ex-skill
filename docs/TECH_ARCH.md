# LinguaWorld — 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                      前端层 (React)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 首页    │ │ 学习页  │ │ 进度页  │ │ 社区页  │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│                    状态管理层 (Zustand)                   │
│  用户状态 | 学习状态 | 社区状态 | UI状态                  │
├─────────────────────────────────────────────────────────┤
│                    路由层 (React Router)                  │
│  / | /learn | /progress | /community | /profile | /auth │
├─────────────────────────────────────────────────────────┤
│                    Mock API 层                           │
│  用户服务 | 课程服务 | 学习服务 | 社区服务                │
├─────────────────────────────────────────────────────────┤
│                    LocalStorage 数据持久化                │
└─────────────────────────────────────────────────────────┘
```

## 2. 技术栈说明

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | 组件化开发，类型安全 |
| 构建工具 | Vite | 快速开发启动，热更新 |
| 样式方案 | Tailwind CSS | 原子化 CSS，快速构建 |
| 状态管理 | Zustand | 轻量级状态管理 |
| 路由管理 | React Router v6 | SPA 路由控制 |
| 图表库 | Recharts | 数据可视化 |
| 图标库 | Lucide React | 线性图标 |
| 日期处理 | date-fns | 轻量日期库 |
| 音频处理 | Web Audio API | 口语录音波形 |

## 3. 路由定义

| 路由路径 | 页面组件 | 功能描述 |
|----------|----------|----------|
| `/` | HomePage | 首页，语言选择、精选课程入口 |
| `/learn/:language/:level` | LearnPage | 学习页面，含单词/语法/口语/听力模块 |
| `/progress` | ProgressPage | 学习进度追踪仪表盘 |
| `/community` | CommunityPage | 社区交流主页 |
| `/profile` | ProfilePage | 个人中心设置 |
| `/auth/login` | LoginPage | 用户登录 |
| `/auth/register` | RegisterPage | 用户注册 |

## 4. 数据模型

### 4.1 用户模型

```typescript
interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  targetLanguage: 'en' | 'ja' | 'ko';
  currentLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  joinDate: string;
  totalXp: number;
  streak: number;
}
```

### 4.2 课程模型

```typescript
interface Course {
  id: string;
  language: 'en' | 'ja' | 'ko';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  description: string;
  lessons: Lesson[];
  thumbnail: string;
}

interface Lesson {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'listening';
  duration: number;
  completed: boolean;
  xpReward: number;
}
```

### 4.3 学习进度模型

```typescript
interface LearningProgress {
  userId: string;
  language: string;
  vocabularyMastered: number;
  grammarCompleted: number;
  speakingMinutes: number;
  listeningHours: number;
  weeklyGoal: number;
  weeklyAchieved: number;
  studyCalendar: Record<string, boolean>;
  abilityScores: {
    vocabulary: number;
    grammar: number;
    speaking: number;
    listening: number;
  };
}
```

### 4.4 社区帖子模型

```typescript
interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  language: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
}
```

### 4.5 成就模型

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  requirement: number;
}
```

## 5. Mock 数据服务

### 5.1 用户服务 (mockUserService)

- `login(email, password)`: Promise\<User\>
- `register(email, password, nickname)`: Promise\<User\>
- `getCurrentUser()`: User | null
- `updateProfile(data)`: Promise\<User\>
- `logout()`: void

### 5.2 课程服务 (mockCourseService)

- `getLanguages()`: Language[]
- `getCoursesByLanguage(lang)`: Course[]
- `getCourseById(id)`: Course
- `getLessonsByCourse(courseId)`: Lesson[]
- `completeLesson(lessonId)`: Promise\<{xp, achievement}\>

### 5.3 进度服务 (mockProgressService)

- `getProgress(userId)`: LearningProgress
- `recordStudyTime(minutes)`: Promise\<void\>
- `updateAbilityScores(scores)`: Promise\<void\>

### 5.4 社区服务 (mockCommunityService)

- `getPosts(language?, page?)`: Promise\<Post\[\]\>
- `createPost(content)`: Promise\<Post\>
- `likePost(postId)`: Promise\<void\>
- `addComment(postId, content)`: Promise\<Comment\>

### 5.5 成就服务 (mockAchievementService)

- `getAchievements()`: Achievement[]
- `checkAndUnlock(userId)`: Promise\<Achievement[]\>

## 6. 组件结构

```
src/
├── components/
│   ├── common/          # 通用组件
│   │   ├── Button
│   │   ├── Card
│   │   ├── Modal
│   │   └── Loading
│   ├── layout/          # 布局组件
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Footer
│   ├── auth/            # 认证组件
│   │   ├── LoginForm
│   │   └── RegisterForm
│   ├── course/          # 课程组件
│   │   ├── LanguageSelector
│   │   ├── CourseCard
│   │   └── LessonList
│   ├── learn/           # 学习模块组件
│   │   ├── FlashCard
│   │   ├── GrammarExercise
│   │   ├── SpeakingRecorder
│   │   └── ListeningPlayer
│   ├── progress/       # 进度组件
│   │   ├── ProgressRing
│   │   ├── StudyCalendar
│   │   └── AbilityRadar
│   ├── community/       # 社区组件
│   │   ├── PostCard
│   │   ├── CommentList
│   │   └── PostEditor
│   └── achievement/     # 成就组件
│       ├── AchievementBadge
│       └── Leaderboard
├── pages/
│   ├── HomePage
│   ├── LearnPage
│   ├── ProgressPage
│   ├── CommunityPage
│   ├── ProfilePage
│   ├── LoginPage
│   └── RegisterPage
├── stores/
│   ├── userStore
│   ├── courseStore
│   ├── progressStore
│   └── communityStore
├── services/
│   ├── mockUserService
│   ├── mockCourseService
│   ├── mockProgressService
│   ├── mockCommunityService
│   └── mockAchievementService
├── hooks/
│   ├── useAuth
│   ├── useLearning
│   └── useProgress
├── types/
│   └── index.ts
└── utils/
    ├── storage.ts
    └── helpers.ts
```

## 7. 状态管理设计

### 7.1 userStore

```typescript
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
```

### 7.2 courseStore

```typescript
interface CourseStore {
  selectedLanguage: 'en' | 'ja' | 'ko';
  selectedLevel: string;
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  selectLanguage: (lang: string) => void;
  selectLevel: (level: string) => void;
  setCurrentLesson: (lesson: Lesson) => void;
}
```

### 7.3 progressStore

```typescript
interface ProgressStore {
  progress: LearningProgress | null;
  todayStudyMinutes: number;
  weeklyStreak: number;
  fetchProgress: () => Promise<void>;
  recordStudy: (type: string, minutes: number) => Promise<void>;
  updateAbility: (scores: AbilityScores) => Promise<void>;
}
```

## 8. 关键实现说明

### 8.1 闪卡翻转动画

使用 CSS `transform: rotateY(180deg)` 实现 3D 翻转效果，配合 `transform-style: preserve-3d` 保持子元素 3D 空间。

### 8.2 口语录音波形

使用 Web Audio API 的 AnalyserNode 获取实时音频数据，通过 Canvas 绘制波形图。

### 8.3 学习日历热力图

使用 CSS Grid 布局 7x5 的日历网格，根据 `studyCalendar` 数据渲染不同深浅的颜色。

### 8.4 能力雷达图

使用 Recharts 的 RadarChart 组件展示词汇、语法、口语、听力四个维度的能力评分。

### 8.5 成就解锁动效

使用 CSS keyframes 动画实现徽章弹出 + 光芒扩散效果。
