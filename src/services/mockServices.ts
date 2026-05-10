import type {
  User,
  RegisterData,
  Paper,
  DetectionReport,
  DetectionLevel,
  SubjectType,
  TextFingerprint,
  LogicFlaw,
  RewriteTrace,
  CitationCheck,
  ParagraphResult,
  Achievement,
  UserAchievement,
  Post,
  Comment,
  PostFilter,
  RiskLevel,
  DailyDetection,
} from '../types';

class MockUserService {
  private static instance: MockUserService;
  private users: User[] = [];
  private currentUser: User | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): MockUserService {
    if (!MockUserService.instance) {
      MockUserService.instance = new MockUserService();
    }
    return MockUserService.instance;
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('zhenxie_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
    const currentUserStr = localStorage.getItem('zhenxie_current_user');
    if (currentUserStr) {
      this.currentUser = JSON.parse(currentUserStr);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('zhenxie_users', JSON.stringify(this.users));
  }

  private saveCurrentUser(): void {
    if (this.currentUser) {
      localStorage.setItem('zhenxie_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('zhenxie_current_user');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string): Promise<User> {
    await this.delay(500);
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.currentUser = user;
      this.saveCurrentUser();
      this.saveToStorage();
      return user;
    }
    throw new Error('用户不存在');
  }

  async register(data: RegisterData): Promise<User> {
    await this.delay(500);
    const exists = this.users.find(u => u.email === data.email);
    if (exists) {
      throw new Error('该邮箱已注册');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      nickname: data.nickname,
      phone: data.phone,
      userType: data.userType,
      institutionType: data.institutionType,
      institutionName: data.institutionName,
      researchField: data.researchField,
      role: 'normal',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nickname}`,
      achievements: [],
      stats: {
        totalDetections: 0,
        totalPapers: 0,
        avgAigcRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyDetections: [0, 0, 0, 0, 0, 0, 0],
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveToStorage();
    this.saveCurrentUser();
    return newUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.delay(300);
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('用户不存在');

    this.users[userIndex] = { ...this.users[userIndex], ...data };
    if (this.currentUser?.id === userId) {
      this.currentUser = this.users[userIndex];
      this.saveCurrentUser();
    }
    this.saveToStorage();
    return this.users[userIndex];
  }

  async updateStats(userId: string, stats: Partial<User['stats']>): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    this.users[userIndex].stats = { ...this.users[userIndex].stats, ...stats };
    if (this.currentUser?.id === userId) {
      this.currentUser = this.users[userIndex];
      this.saveCurrentUser();
    }
    this.saveToStorage();
  }

  addAchievement(userId: string, achievementId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user && !user.achievements.includes(achievementId)) {
      user.achievements.push(achievementId);
      if (this.currentUser?.id === userId) {
        this.currentUser = user;
        this.saveCurrentUser();
      }
      this.saveToStorage();
    }
  }
}

class MockDetectionService {
  private static instance: MockDetectionService;
  private papers: Paper[] = [];
  private reports: DetectionReport[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): MockDetectionService {
    if (!MockDetectionService.instance) {
      MockDetectionService.instance = new MockDetectionService();
    }
    return MockDetectionService.instance;
  }

  private loadFromStorage(): void {
    const papersStr = localStorage.getItem('zhenxie_papers');
    if (papersStr) this.papers = JSON.parse(papersStr);
    const reportsStr = localStorage.getItem('zhenxie_reports');
    if (reportsStr) this.reports = JSON.parse(reportsStr);
  }

  private saveToStorage(): void {
    localStorage.setItem('zhenxie_papers', JSON.stringify(this.papers));
    localStorage.setItem('zhenxie_reports', JSON.stringify(this.reports));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getRiskLevel(probability: number): RiskLevel {
    if (probability < 30) return 'low';
    if (probability < 70) return 'medium';
    return 'high';
  }

  private analyzeTextFingerprint(text: string): TextFingerprint {
    const aiTypicalWords = ['首先', '其次', '最后', '综上所述', '因此', '然而', '值得注意的是', '众所周知', '不难发现', '由此可见'];
    const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
    const wordChains: { words: string[]; frequency: number; position: number }[] = [];

    for (let i = 0; i <= words.length - 3; i++) {
      const chain = words.slice(i, i + 3).join('');
      const existing = wordChains.find(c => c.words.join('') === chain);
      if (existing) {
        existing.frequency++;
      } else {
        wordChains.push({ words: words.slice(i, i + 3), frequency: 1, position: i });
      }
    }

    const aiPatterns = aiTypicalWords
      .filter(word => text.includes(word))
      .map(word => ({
        pattern: word,
        matchedText: word,
        position: text.indexOf(word),
        confidence: 0.85,
      }));

    return {
      highFreqWordChains: wordChains.filter(c => c.frequency >= 2).slice(0, 10),
      punctuationPatterns: [],
      rareCollocation: [],
      aiCommonPatterns: aiPatterns,
    };
  }

  private detectLogicFlaws(paragraphs: string[]): LogicFlaw[] {
    const flaws: LogicFlaw[] = [];
    paragraphs.forEach((para, pIdx) => {
      if (para.includes('因此') && para.includes('所以')) {
        flaws.push({
          type: 'causality',
          paragraph: pIdx,
          sentence: 0,
          severity: 'medium',
          description: '检测到因果关系表述不够明确',
          suggestion: '建议明确因果关系的逻辑连接',
        });
      }
      if ((para.match(/因此/g) || []).length >= 2) {
        flaws.push({
          type: 'repetition',
          paragraph: pIdx,
          sentence: 0,
          severity: 'low',
          description: '同一段落中多次使用"因此"',
          suggestion: '建议使用其他因果连接词替代',
        });
      }
    });
    return flaws;
  }

  private checkCitations(text: string): CitationCheck[] {
    const citations: CitationCheck[] = [];
    const doiRegex = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;
    const matches = text.match(doiRegex) || [];

    matches.forEach(doi => {
      const isValid = Math.random() > 0.3;
      const issues: CitationCheck['issues'] = [];
      if (!isValid) {
        issues.push(Math.random() > 0.5 ? 'doi_invalid' : 'doi_not_found');
      }
      citations.push({
        citation: `[DOI: ${doi}]`,
        doi,
        isValid,
        issues,
        suggestedFix: !isValid ? '请核实DOI有效性' : undefined,
      });
    });

    return citations;
  }

  async submitPaper(paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>): Promise<Paper> {
    await this.delay(300);
    const paper: Paper = {
      ...paperData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.papers.push(paper);
    this.saveToStorage();
    return paper;
  }

  async processDetection(paperId: string, level: DetectionLevel): Promise<DetectionReport> {
    const paper = this.papers.find(p => p.id === paperId);
    if (!paper) throw new Error('论文不存在');

    paper.status = 'processing';
    this.saveToStorage();

    const processingTimes: Record<DetectionLevel, number> = {
      basic: 2000,
      standard: 4000,
      deep: 8000,
    };
    await this.delay(processingTimes[level]);

    const paragraphs = paper.content.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphResults: ParagraphResult[] = paragraphs.map((content, index) => {
      const baseProb = Math.random() * 60 + 10;
      const aiBonus = content.includes('首先') || content.includes('其次') || content.includes('最后') ? 15 : 0;
      const probability = Math.min(95, Math.round(baseProb + aiBonus));

      return {
        index,
        content,
        startChar: 0,
        endChar: content.length,
        aigcProbability: probability,
        riskLevel: this.getRiskLevel(probability),
        issues: probability > 50 ? [{
          type: 'ai_pattern' as const,
          description: '检测到AI典型表达',
          position: { start: 0, end: content.length },
          confidence: 0.8,
        }] : [],
      };
    });

    const overallAigcRate = Math.round(
      paragraphResults.reduce((sum, p) => sum + p.aigcProbability, 0) / paragraphResults.length
    );

    const sectionNames = ['摘要', '引言', '方法', '结果', '讨论', '结论'];
    const sectionStats = sectionNames.map((name, idx) => ({
      name,
      startIndex: idx * Math.floor(paragraphs.length / 6),
      endIndex: (idx + 1) * Math.floor(paragraphs.length / 6),
      aigcRate: Math.round(Math.random() * 40 + 20),
      paragraphCount: Math.floor(paragraphs.length / 6),
      highRiskCount: Math.floor(Math.random() * 3),
    }));

    const report: DetectionReport = {
      id: this.generateId(),
      paperId,
      userId: paper.userId,
      overallAigcRate,
      paragraphResults,
      fingerprintAnalysis: this.analyzeTextFingerprint(paper.content),
      logicFlaws: level !== 'basic' ? this.detectLogicFlaws(paragraphs) : [],
      rewriteTraces: level === 'deep' ? [] : [],
      citationChecks: level !== 'basic' ? this.checkCitations(paper.content) : [],
      sectionStats,
      suggestions: paragraphResults
        .filter(p => p.riskLevel !== 'low')
        .slice(0, 5)
        .map(p => ({
          type: 'rewrite' as const,
          targetText: p.content.substring(0, 50) + '...',
          suggestion: '建议使用更自然的表达方式',
          reason: '该段落AIGC概率较高',
          priority: p.aigcProbability > 70 ? 1 : 2,
        })),
      version: paper.version,
      detectionLevel: level,
      subject: paper.subject,
      processingTime: processingTimes[level],
      createdAt: new Date().toISOString(),
    };

    paper.status = 'completed';
    paper.updatedAt = new Date().toISOString();
    this.reports.push(report);
    this.saveToStorage();

    return report;
  }

  async getReports(userId: string): Promise<DetectionReport[]> {
    return this.reports.filter(r => r.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getReport(reportId: string): Promise<DetectionReport | null> {
    return this.reports.find(r => r.id === reportId) || null;
  }

  async generateCertificate(reportId: string): Promise<string> {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) throw new Error('报告不存在');

    report.certificateCode = `ZX${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    this.saveToStorage();
    return report.certificateCode;
  }

  async getDailyDetections(userId: string, days: number = 30): Promise<DailyDetection[]> {
    const reports = this.reports.filter(r => r.userId === userId);
    const result: DailyDetection[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayReports = reports.filter(r => r.createdAt.startsWith(dateStr));
      result.push({
        date: dateStr,
        count: dayReports.length,
        avgAigcRate: dayReports.length > 0
          ? Math.round(dayReports.reduce((sum, r) => sum + r.overallAigcRate, 0) / dayReports.length)
          : 0,
      });
    }

    return result;
  }
}

class MockCommunityService {
  private static instance: MockCommunityService;
  private posts: Post[] = [];
  private comments: Comment[] = [];

  private constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  static getInstance(): MockCommunityService {
    if (!MockCommunityService.instance) {
      MockCommunityService.instance = new MockCommunityService();
    }
    return MockCommunityService.instance;
  }

  private loadFromStorage(): void {
    const postsStr = localStorage.getItem('zhenxie_posts');
    if (postsStr) this.posts = JSON.parse(postsStr);
    const commentsStr = localStorage.getItem('zhenxie_comments');
    if (commentsStr) this.comments = JSON.parse(commentsStr);
  }

  private saveToStorage(): void {
    localStorage.setItem('zhenxie_posts', JSON.stringify(this.posts));
    localStorage.setItem('zhenxie_comments', JSON.stringify(this.comments));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    if (this.posts.length === 0) {
      const sampleUsers: User[] = [
        {
          id: 'user_sample1',
          email: 'zhangsan@example.com',
          nickname: '学术小能手',
          userType: 'personal',
          role: 'verified',
          achievements: [],
          stats: { totalDetections: 25, totalPapers: 20, avgAigcRate: 15, currentStreak: 15, longestStreak: 30, weeklyDetections: [1, 2, 3, 2, 1, 2, 1] },
          createdAt: '2024-01-01',
          lastLoginAt: '2024-06-01',
        },
        {
          id: 'user_sample2',
          email: 'lisi@example.com',
          nickname: '降AI达人',
          userType: 'personal',
          role: 'normal',
          achievements: [],
          stats: { totalDetections: 18, totalPapers: 15, avgAigcRate: 22, currentStreak: 8, longestStreak: 20, weeklyDetections: [1, 1, 2, 2, 1, 1, 1] },
          createdAt: '2024-02-01',
          lastLoginAt: '2024-06-01',
        },
        {
          id: 'user_sample3',
          email: 'wangwu@example.com',
          nickname: '论文研究者',
          userType: 'institutional',
          institutionType: 'university',
          institutionName: '清华大学',
          role: 'admin',
          achievements: [],
          stats: { totalDetections: 100, totalPapers: 80, avgAigcRate: 12, currentStreak: 50, longestStreak: 60, weeklyDetections: [5, 6, 7, 5, 6, 4, 3] },
          createdAt: '2023-12-01',
          lastLoginAt: '2024-06-01',
        },
      ];

      const samplePosts: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          userId: 'user_sample1',
          user: sampleUsers[0],
          title: '如何有效降低论文的AIGC率？经验分享',
          content: '作为一名在学术界摸爬滚打多年的研究者，我总结了一些降低AIGC率的经验：\n\n1. 多使用主动语态，少用被动语态\n2. 避免过度使用"首先、其次、最后"等连接词\n3. 增加原创性分析和见解\n4. 适当使用学科专业术语\n5. 保持写作风格的一致性\n\n希望对大家有帮助！',
          category: 'sharing',
          subject: 'other',
          likes: 128,
          comments: 45,
          views: 1234,
          isPinned: true,
          isFeatured: true,
          tags: ['降AI技巧', '论文写作', '经验分享'],
        },
        {
          userId: 'user_sample2',
          user: sampleUsers[1],
          title: 'ChatGPT生成的文本有哪些明显特征？',
          content: '经过大量测试，我发现ChatGPT生成的文本有以下特征：\n\n1. 过度使用"首先"、"其次"、"最后"等序数词\n2. 频繁使用"因此"、"然而"、"综上所述"等过渡词\n3. 句式过于规整，缺少变化\n4. 词汇多样性较低\n5. 逻辑过于完美，缺少真实的思考过程\n\n欢迎补充！',
          category: 'discussion',
          subject: 'science',
          likes: 89,
          comments: 32,
          views: 876,
          isPinned: false,
          isFeatured: true,
          tags: ['ChatGPT', 'AI检测', '文本特征'],
        },
        {
          userId: 'user_sample3',
          user: sampleUsers[2],
          title: '【求助】深度检测显示改写痕迹如何消除？',
          content: '我的论文在深度检测中被标记为有改写痕迹，但内容都是我亲自撰写的。请问这种情况应该如何处理？\n\n论文是关于人工智能在医学影像诊断中的应用，使用了一些标准的技术术语和规范表述方法。',
          category: 'help',
          subject: 'medicine',
          likes: 23,
          comments: 18,
          views: 234,
          isPinned: false,
          isFeatured: false,
          tags: ['求助', '改写痕迹', '深度检测'],
        },
        {
          userId: 'user_sample1',
          user: sampleUsers[0],
          title: '理工科论文降AI实操指南',
          content: '针对理工科论文的特殊性，我总结了一套降AI实操方法：\n\n1. 数据描述要具体，避免泛泛而谈\n2. 方法论部分多描述实际操作步骤\n3. 结果分析要有个人见解\n4. 图表说明要详细准确\n5. 引用真实可靠的文献\n\n理工科的严谨性本身就是最好的原创证明。',
          category: 'technique',
          subject: 'science',
          likes: 156,
          comments: 52,
          views: 1567,
          isPinned: false,
          isFeatured: false,
          tags: ['理工科', '降AI指南', '论文优化'],
        },
      ];

      const now = new Date();
      this.posts = samplePosts.map((post, idx) => ({
        ...post,
        id: `post_${idx + 1}`,
        createdAt: new Date(now.getTime() - idx * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - idx * 86400000).toISOString(),
      }));
      this.saveToStorage();
    }
  }

  async getPosts(filter?: PostFilter): Promise<Post[]> {
    await this.delay(300);
    let filtered = [...this.posts];

    if (filter?.category) {
      filtered = filtered.filter(p => p.category === filter.category);
    }
    if (filter?.subject) {
      filtered = filtered.filter(p => p.subject === filter.subject);
    }
    if (filter?.keyword) {
      const kw = filter.keyword.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw)
      );
    }

    switch (filter?.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'most_commented':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }

  async getPost(postId: string): Promise<Post | null> {
    return this.posts.find(p => p.id === postId) || null;
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    await this.delay(300);
    const post: Post = {
      ...postData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.posts.unshift(post);
    this.saveToStorage();
    return post;
  }

  async updatePost(postId: string, data: Partial<Post>): Promise<Post> {
    await this.delay(200);
    const index = this.posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error('帖子不存在');

    this.posts[index] = { ...this.posts[index], ...data, updatedAt: new Date().toISOString() };
    this.saveToStorage();
    return this.posts[index];
  }

  async deletePost(postId: string): Promise<void> {
    await this.delay(200);
    this.posts = this.posts.filter(p => p.id !== postId);
    this.comments = this.comments.filter(c => c.postId !== postId);
    this.saveToStorage();
  }

  async likePost(postId: string): Promise<number> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('帖子不存在');
    post.likes++;
    this.saveToStorage();
    return post.likes;
  }

  async getComments(postId: string): Promise<Comment[]> {
    await this.delay(200);
    return this.comments.filter(c => c.postId === postId).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async addComment(postId: string, user: User, content: string): Promise<Comment> {
    await this.delay(200);
    const comment: Comment = {
      id: this.generateId(),
      postId,
      userId: user.id,
      user,
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.comments.push(comment);

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments++;
    }

    this.saveToStorage();
    return comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.delay(200);
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      const post = this.posts.find(p => p.id === comment.postId);
      if (post && post.comments > 0) {
        post.comments--;
      }
    }
    this.comments = this.comments.filter(c => c.id !== commentId);
    this.saveToStorage();
  }
}

class MockAchievementService {
  private static instance: MockAchievementService;
  private achievements: Achievement[] = [];
  private userAchievements: UserAchievement[] = [];

  private constructor() {
    this.loadFromStorage();
    this.initializeDefaultAchievements();
  }

  static getInstance(): MockAchievementService {
    if (!MockAchievementService.instance) {
      MockAchievementService.instance = new MockAchievementService();
    }
    return MockAchievementService.instance;
  }

  private loadFromStorage(): void {
    const achievementsStr = localStorage.getItem('zhenxie_achievements');
    if (achievementsStr) this.achievements = JSON.parse(achievementsStr);
    const userAchievementsStr = localStorage.getItem('zhenxie_user_achievements');
    if (userAchievementsStr) this.userAchievements = JSON.parse(userAchievementsStr);
  }

  private saveToStorage(): void {
    localStorage.setItem('zhenxie_achievements', JSON.stringify(this.achievements));
    localStorage.setItem('zhenxie_user_achievements', JSON.stringify(this.userAchievements));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultAchievements(): void {
    if (this.achievements.length === 0) {
      this.achievements = [
        {
          id: 'ach_sincere',
          name: '句句真心',
          description: '单篇论文人工撰写比例超90%',
          icon: '🖋️',
          condition: { type: 'aigc_rate', threshold: 10 },
          rarity: 'rare',
          points: 100,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_detective',
          name: '文献侦探',
          description: '成功修正3条虚构参考文献',
          icon: '🔍',
          condition: { type: 'citation_fix', threshold: 3 },
          rarity: 'epic',
          points: 200,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_logic_master',
          name: '逻辑大师',
          description: '连续5次检测无高频AI逻辑错误',
          icon: '🧠',
          condition: { type: 'logic_check', threshold: 5 },
          rarity: 'epic',
          points: 150,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_first_detect',
          name: '初试锋芒',
          description: '完成首次论文检测',
          icon: '⭐',
          condition: { type: 'detection_count', threshold: 1 },
          rarity: 'common',
          points: 50,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_ten_detect',
          name: '深度探索者',
          description: '完成10次深度检测',
          icon: '🔬',
          condition: { type: 'detection_count', threshold: 10 },
          rarity: 'rare',
          points: 150,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_streak_30',
          name: '原创卫士',
          description: '连续30天AIGC率低于5%',
          icon: '🛡️',
          condition: { type: 'streak', threshold: 30 },
          rarity: 'legendary',
          points: 500,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_streak_7',
          name: '持之以恒',
          description: '连续7天进行检测',
          icon: '📅',
          condition: { type: 'streak', threshold: 7 },
          rarity: 'common',
          points: 50,
          createdAt: '2024-01-01',
        },
        {
          id: 'ach_fifty_detect',
          name: '检测达人',
          description: '累计完成50次检测',
          icon: '🏆',
          condition: { type: 'detection_count', threshold: 50 },
          rarity: 'epic',
          points: 300,
          createdAt: '2024-01-01',
        },
      ];
      this.saveToStorage();
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    return this.achievements;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievements.filter(ua => ua.userId === userId);
  }

  async checkAndUnlock(userId: string, stats: User['stats']): Promise<Achievement[]> {
    const unlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      const userAch = this.userAchievements.find(
        ua => ua.userId === userId && ua.achievementId === achievement.id
      );
      if (userAch) continue;

      let shouldUnlock = false;

      switch (achievement.condition.type) {
        case 'detection_count':
          shouldUnlock = stats.totalDetections >= achievement.condition.threshold;
          break;
        case 'streak':
          shouldUnlock = stats.currentStreak >= achievement.condition.threshold;
          break;
        case 'aigc_rate':
          shouldUnlock = stats.avgAigcRate <= achievement.condition.threshold;
          break;
      }

      if (shouldUnlock) {
        const newUserAch: UserAchievement = {
          id: this.generateId(),
          achievementId: achievement.id,
          userId,
          unlockedAt: new Date().toISOString(),
          progress: 100,
        };
        this.userAchievements.push(newUserAch);
        unlocked.push(achievement);
      }
    }

    if (unlocked.length > 0) {
      this.saveToStorage();
    }

    return unlocked;
  }

  async updateProgress(
    userId: string,
    conditionType: Achievement['condition']['type'],
    value: number
  ): Promise<void> {
    const relevantAchievements = this.achievements.filter(a => a.condition.type === conditionType);

    for (const achievement of relevantAchievements) {
      let userAch = this.userAchievements.find(
        ua => ua.userId === userId && ua.achievementId === achievement.id
      );

      if (!userAch) {
        userAch = {
          id: this.generateId(),
          achievementId: achievement.id,
          userId,
          unlockedAt: '',
          progress: 0,
        };
        this.userAchievements.push(userAch);
      }

      const progress = Math.min(100, (value / achievement.condition.threshold) * 100);
      userAch.progress = Math.round(progress);
    }

    this.saveToStorage();
  }
}

export const userService = MockUserService.getInstance();
export const detectionService = MockDetectionService.getInstance();
export const communityService = MockCommunityService.getInstance();
export const achievementService = MockAchievementService.getInstance();
