import type { User, Course, Lesson, LearningProgress, Post, Achievement, LanguageInfo } from '../types';

const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

const generateId = () => Math.random().toString(36).substring(2, 15);

const mockVocabulary = [
  { id: '1', word: 'Hello', translation: '你好', pronunciation: '/həˈloʊ/', example: 'Hello, how are you?', exampleTranslation: '你好，你好吗？' },
  { id: '2', word: 'Thank you', translation: '谢谢', pronunciation: '/θæŋk juː/', example: 'Thank you for your help.', exampleTranslation: '谢谢你的帮助。' },
  { id: '3', word: 'Goodbye', translation: '再见', pronunciation: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow!', exampleTranslation: '再见，明天见！' },
  { id: '4', word: 'Please', translation: '请', pronunciation: '/pliːz/', example: 'Please sit down.', exampleTranslation: '请坐下。' },
  { id: '5', word: 'Sorry', translation: '对不起', pronunciation: '/ˈsɒri/', example: 'I am sorry for being late.', exampleTranslation: '对不起，我迟到了。' },
];

const mockGrammar = [
  { id: '1', rule: 'Present Simple', explanation: '用于描述习惯性动作、事实和普遍真理', examples: [{ original: 'I eat breakfast every day.', translated: '我每天吃早餐。' }, { original: 'She works in a bank.', translated: '她在银行工作。' }] },
  { id: '2', rule: 'Present Continuous', explanation: '用于描述正在发生的动作', examples: [{ original: 'I am reading a book.', translated: '我正在读一本书。' }, { original: 'They are playing football.', translated: '他们正在踢足球。' }] },
  { id: '3', rule: 'Past Simple', explanation: '用于描述过去完成的动作', examples: [{ original: 'I visited Paris last year.', translated: '我去年去了巴黎。' }, { original: 'She finished her homework.', translated: '她完成了作业。' }] },
  { id: '4', rule: 'Future Simple', explanation: '用于描述将来的动作', examples: [{ original: 'I will call you tomorrow.', translated: '我明天会给你打电话。' }, { original: 'It will rain soon.', translated: '马上就要下雨了。' }] },
];

const mockSpeaking = [
  { id: '1', prompt: 'Introduce yourself', translation: '介绍你自己', audioUrl: '' },
  { id: '2', prompt: 'Describe your hometown', translation: '描述你的家乡', audioUrl: '' },
  { id: '3', prompt: 'Talk about your hobbies', translation: '谈谈你的爱好', audioUrl: '' },
  { id: '4', prompt: 'Describe your daily routine', translation: '描述你的一天', audioUrl: '' },
];

const mockListening = [
  { id: '1', title: 'At the Restaurant', transcript: 'Welcome to our restaurant. What would you like to order today?', translation: '欢迎光临我们的餐厅。您今天想点什么？', audioUrl: '' },
  { id: '2', title: 'Asking for Directions', transcript: 'Excuse me, how do I get to the train station?', translation: '打扰一下，请问去火车站怎么走？', audioUrl: '' },
  { id: '3', title: 'Making a Phone Call', transcript: 'Hello, may I speak to Mr. Smith please?', translation: '你好，请问Smith先生在吗？', audioUrl: '' },
  { id: '4', title: 'Job Interview', transcript: 'Can you tell me about your previous work experience?', translation: '您能介绍一下您之前的工作经历吗？', audioUrl: '' },
];

const mockLessons: Lesson[] = [
  { id: 'v1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false, xpReward: 20, content: mockVocabulary },
  { id: 'g1', title: '时态入门', type: 'grammar', duration: 15, completed: false, xpReward: 30, content: mockGrammar },
  { id: 's1', title: '自我介绍', type: 'speaking', duration: 5, completed: false, xpReward: 25, content: mockSpeaking },
  { id: 'l1', title: '日常对话', type: 'listening', duration: 10, completed: false, xpReward: 20, content: mockListening },
];

const mockCourses: Course[] = [
  { id: 'en-a1', language: 'en', level: 'A1', title: '英语入门', description: '从零开始学习英语，掌握日常交流基础词汇和简单句型', lessons: mockLessons, thumbnail: '', lessonCount: 4, estimatedHours: 40 },
  { id: 'en-a2', language: 'en', level: 'A2', title: '英语基础', description: '巩固基础语法，扩大词汇量，能够进行简单对话', lessons: [], thumbnail: '', lessonCount: 6, estimatedHours: 60 },
  { id: 'en-b1', language: 'en', level: 'B1', title: '英语中级', description: '提升语言流利度，能够表达观点和讨论话题', lessons: [], thumbnail: '', lessonCount: 8, estimatedHours: 80 },
  { id: 'ja-a1', language: 'ja', level: 'A1', title: '日语入门', description: '学习日语假名（五十音图）和基础会话表达', lessons: mockLessons, thumbnail: '', lessonCount: 4, estimatedHours: 50 },
  { id: 'ja-a2', language: 'ja', level: 'A2', title: '日语基础', description: '掌握基本语法和日常词汇，能够阅读简单句子', lessons: [], thumbnail: '', lessonCount: 6, estimatedHours: 70 },
  { id: 'ko-a1', language: 'ko', level: 'A1', title: '韩语入门', description: '学习韩文字母（Hangul）和基础问候语', lessons: mockLessons, thumbnail: '', lessonCount: 4, estimatedHours: 40 },
];

const mockPosts: Post[] = [
  { id: '1', authorId: '1', authorName: '语言爱好者', authorAvatar: '', language: 'en', content: '坚持学习英语的第30天！从完全不会开口到现在可以进行日常对话，成就感满满！🎉', likes: 128, comments: 23, createdAt: '2024-01-15T10:30:00', isLiked: false },
  { id: '2', authorId: '2', authorName: '日语小王子', authorAvatar: '', language: 'ja', content: '分享我的日语学习方法：每天看一集动漫，然后记录不认识的单词。大家有什么好的建议吗？', likes: 89, comments: 15, createdAt: '2024-01-14T18:20:00', isLiked: true },
  { id: '3', authorId: '3', authorName: '韩流粉丝', authorAvatar: '', language: 'ko', content: '终于可以用韩语看懂偶像的直播了！学韩语的第60天，感觉一切都值得！💪', likes: 256, comments: 42, createdAt: '2024-01-14T12:00:00', isLiked: false },
  { id: '4', authorId: '4', authorName: '学霸小明', authorAvatar: '', language: 'en', content: '推荐一个超级好用的背单词App，配合艾宾浩斯记忆曲线，效率提升200%！', likes: 67, comments: 8, createdAt: '2024-01-13T20:45:00', isLiked: false },
];

const mockAchievements: Achievement[] = [
  { id: 'first-login', name: '初次见面', description: '完成首次登录', icon: 'Sparkles', requirement: 1, category: 'milestone' },
  { id: 'streak-7', name: '一周坚持', description: '连续学习7天', icon: 'Flame', requirement: 7, category: 'streak' },
  { id: 'streak-30', name: '月度学习者', description: '连续学习30天', icon: 'Trophy', requirement: 30, category: 'streak' },
  { id: 'lessons-10', name: '初露头角', description: '完成10节课', icon: 'BookOpen', requirement: 10, category: 'lesson' },
  { id: 'vocab-100', name: '词汇达人', description: '掌握100个单词', icon: 'Brain', requirement: 100, category: 'vocabulary' },
  { id: 'social-first', name: '社交达人', description: '发表第一篇帖子', icon: 'MessageCircle', requirement: 1, category: 'social' },
  { id: 'perfect-score', name: '满分达成', description: '单次练习获得满分', icon: 'Star', requirement: 1, category: 'milestone' },
];

const STORAGE_KEYS = {
  USER: 'linguaworld_user',
  PROGRESS: 'linguaworld_progress',
  POSTS: 'linguaworld_posts',
  ACHIEVEMENTS: 'linguaworld_achievements',
};

class MockUserService {
  private getUsers(): (User & { password: string })[] {
    const stored = localStorage.getItem('linguaworld_users');
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(users: (User & { password: string })[]): void {
    localStorage.setItem('linguaworld_users', JSON.stringify(users));
  }

  async login(email: string, password: string): Promise<User> {
    await this.delay(800);
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('邮箱或密码错误');
    }
    const { password: _, ...userData } = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return userData;
  }

  async register(email: string, password: string, nickname: string): Promise<User> {
    await this.delay(800);
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('该邮箱已被注册');
    }
    const newUser: User & { password: string } = {
      id: generateId(),
      email,
      password,
      nickname,
      avatar: '',
      targetLanguage: 'en',
      currentLevel: 'A1',
      joinDate: new Date().toISOString(),
      totalXp: 0,
      streak: 0,
    };
    users.push(newUser);
    this.saveUsers(users);
    const { password: _, ...userData } = newUser;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return userData;
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    await this.delay(300);
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('用户未登录');
    const updatedUser = { ...currentUser, ...data };
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...data };
      this.saveUsers(users);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return updatedUser;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class MockCourseService {
  getLanguages(): LanguageInfo[] {
    return LANGUAGES;
  }

  getCoursesByLanguage(lang: string): Course[] {
    return mockCourses.filter(c => c.language === lang);
  }

  getCourseById(id: string): Course | undefined {
    return mockCourses.find(c => c.id === id);
  }

  getLessonsByCourse(courseId: string): Lesson[] {
    const course = this.getCourseById(courseId);
    return course?.lessons || mockLessons;
  }
}

class MockProgressService {
  private getProgress(userId: string): LearningProgress {
    const stored = localStorage.getItem(`${STORAGE_KEYS.PROGRESS}_${userId}`);
    if (stored) return JSON.parse(stored);
    return this.createDefaultProgress(userId);
  }

  private createDefaultProgress(userId: string): LearningProgress {
    const today = new Date().toISOString().split('T')[0];
    return {
      userId,
      language: 'en',
      vocabularyMastered: 0,
      grammarCompleted: 0,
      speakingMinutes: 0,
      listeningHours: 0,
      weeklyGoal: 300,
      weeklyAchieved: 0,
      studyCalendar: { [today]: true },
      abilityScores: { vocabulary: 0, grammar: 0, speaking: 0, listening: 0 },
    };
  }

  async fetchProgress(userId: string): Promise<LearningProgress> {
    await this.delay(300);
    return this.getProgress(userId);
  }

  async recordStudy(userId: string, type: string, minutes: number): Promise<LearningProgress> {
    await this.delay(200);
    const progress = this.getProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    progress.studyCalendar[today] = true;
    progress.weeklyAchieved += minutes;
    
    switch (type) {
      case 'vocabulary':
        progress.vocabularyMastered += minutes;
        progress.abilityScores.vocabulary = Math.min(100, progress.abilityScores.vocabulary + minutes / 2);
        break;
      case 'grammar':
        progress.grammarCompleted += minutes;
        progress.abilityScores.grammar = Math.min(100, progress.abilityScores.grammar + minutes / 2);
        break;
      case 'speaking':
        progress.speakingMinutes += minutes;
        progress.abilityScores.speaking = Math.min(100, progress.abilityScores.speaking + minutes / 2);
        break;
      case 'listening':
        progress.listeningHours += minutes / 60;
        progress.abilityScores.listening = Math.min(100, progress.abilityScores.listening + minutes / 2);
        break;
    }

    localStorage.setItem(`${STORAGE_KEYS.PROGRESS}_${userId}`, JSON.stringify(progress));
    return progress;
  }

  async updateAbilityScores(userId: string, scores: Partial<LearningProgress['abilityScores']>): Promise<LearningProgress> {
    await this.delay(200);
    const progress = this.getProgress(userId);
    progress.abilityScores = { ...progress.abilityScores, ...scores };
    localStorage.setItem(`${STORAGE_KEYS.PROGRESS}_${userId}`, JSON.stringify(progress));
    return progress;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class MockCommunityService {
  async getPosts(language?: string, page = 1): Promise<Post[]> {
    await this.delay(400);
    let posts = [...mockPosts];
    if (language) {
      posts = posts.filter(p => p.language === language);
    }
    return posts;
  }

  async createPost(content: string, language: string, author: User): Promise<Post> {
    await this.delay(300);
    const newPost: Post = {
      id: generateId(),
      authorId: author.id,
      authorName: author.nickname,
      authorAvatar: author.avatar,
      language: language as any,
      content,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };
    mockPosts.unshift(newPost);
    return newPost;
  }

  async likePost(postId: string): Promise<void> {
    await this.delay(200);
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class MockAchievementService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAchievements(): Promise<Achievement[]> {
    await this.delay(200);
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (stored) {
      const unlocked: Record<string, string> = JSON.parse(stored);
      return mockAchievements.map(a => ({
        ...a,
        unlockedAt: unlocked[a.id],
      }));
    }
    return mockAchievements;
  }

  async unlockAchievement(achievementId: string): Promise<Achievement | null> {
    await this.delay(100);
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const unlocked: Record<string, string> = stored ? JSON.parse(stored) : {};
    
    if (!unlocked[achievementId]) {
      unlocked[achievementId] = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlocked));
      const achievement = mockAchievements.find(a => a.id === achievementId);
      return achievement ? { ...achievement, unlockedAt: unlocked[achievementId] } : null;
    }
    return null;
  }
}

export const userService = new MockUserService();
export const courseService = new MockCourseService();
export const progressService = new MockProgressService();
export const communityService = new MockCommunityService();
export const achievementService = new MockAchievementService();
