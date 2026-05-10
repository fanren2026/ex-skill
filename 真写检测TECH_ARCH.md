# 真写·检测 - 技术架构文档

## 1. 技术架构概述

### 1.1 项目技术愿景

「真写·检测」作为专业的学术论文AIGC检测平台，技术架构设计围绕三个核心目标展开。首先是**精准性**，通过多维度的文本特征提取和智能分析，确保检测结果的可靠性；其次是**高效性**，采用模拟的异步处理机制，保证用户获得流畅的交互体验；最后是**扩展性**，模块化的服务设计便于后续功能迭代和性能优化。整体技术栈选择React 18配合TypeScript，既能保证类型安全，又能支持复杂业务逻辑的快速开发。

### 1.2 技术栈选型理由

前端框架选用React 18.2版本，基于其成熟的生态系统和优秀的组件化开发体验。TypeScript 5.0的引入为项目提供了完善的类型检查能力，有效降低运行时错误风险。状态管理采用Zustand 4.4，相比Redux更加轻量且API简洁，特别适合中大型单页应用的开发需求。路由管理使用React Router v6，其声明式路由配置和嵌套路由能力能够优雅地处理页面层级关系。样式方案选择Tailwind CSS 3.4，通过原子化CSS理念实现高效的样式开发，同时保证最终包体积的可控性。

数据可视化方面，Recharts 2.8承担了折线图、柱状图等基础图表的渲染工作，其React友好的API设计和完善的TypeScript支持使得图表开发更加顺畅。图标库采用Lucide React，这是一套基于Lucideicons的开源图标库，风格统一且包体积较小。日期处理使用date-fns 2.30，该库采用函数式API设计，支持Tree-shaking，对包体积友好。

### 1.3 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端表现层                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ 首页    │ │ 检测页  │ │ 进度页  │ │ 社区页  │ │ 个人页  │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
│       │          │          │          │          │        │
├───────┴──────────┴──────────┴──────────┴──────────┴────────┤
│                        状态管理层                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 用户状态 │ │ 检测状态 │ │ 社区状态 │ │ 成就状态 │       │
│  │ userStore│ │detectStore│ │community │ │achievement│       │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘       │
│        │            │            │            │             │
├────────┴────────────┴────────────┴────────────┴────────────┤
│                        服务层                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │用户服务  │ │检测服务  │ │社区服务  │ │成就服务  │       │
│  │MockUser │ │MockDetect│ │MockComm  │ │MockAchieve│       │
│  │Service  │ │Service   │ │Service   │ │mentService│       │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘       │
│        │            │            │            │             │
├────────┴────────────┴────────────┴────────────┴────────────┤
│                        数据层                                │
│  ┌──────────────────────────────────────────┐               │
│  │              LocalStorage                 │               │
│  │  用户信息 │ 检测记录 │ 社区数据 │ 成就进度  │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## 2. 目录结构设计

### 2.1 整体目录架构

```
src/
├── components/                 # 可复用组件目录
│   ├── layout/                # 布局组件
│   │   ├── Header.tsx         # 顶部导航栏
│   │   └── Layout.tsx         # 页面布局容器
│   ├── detection/            # 检测相关组件
│   │   ├── HeatmapViewer.tsx  # 热力图查看器
│   │   ├── ProgressTracker.tsx # 检测进度追踪器
│   │   ├── ReportCard.tsx     # 报告卡片组件
│   │   └── FileUploader.tsx   # 文件上传组件
│   ├── charts/               # 图表组件
│   │   ├── RadarChart.tsx    # 雷达图组件
│   │   ├── LineChart.tsx     # 折线图组件
│   │   └── CalendarHeatmap.tsx # 日历热力图
│   └── common/              # 通用组件
│       ├── Button.tsx       # 按钮组件
│       ├── Card.tsx         # 卡片组件
│       ├── Modal.tsx        # 模态框组件
│       └── Badge.tsx        # 徽章组件
├── pages/                   # 页面组件目录
│   ├── HomePage.tsx        # 首页
│   ├── DetectPage.tsx      # 检测页面
│   ├── ProgressPage.tsx    # 进度追踪页面
│   ├── CommunityPage.tsx  # 社区页面
│   ├── ProfilePage.tsx     # 个人中心页面
│   ├── LoginPage.tsx      # 登录页面
│   └── RegisterPage.tsx   # 注册页面
├── services/               # 服务层目录
│   ├── mockServices.ts    # Mock服务实现
│   └── api.ts            # API接口定义（预留）
├── stores/                # 状态管理目录
│   ├── userStore.ts      # 用户状态管理
│   ├── detectionStore.ts # 检测状态管理
│   ├── communityStore.ts # 社区状态管理
│   └── achievementStore.ts # 成就状态管理
├── types/                 # 类型定义目录
│   └── index.ts          # 全局类型定义
├── utils/                # 工具函数目录
│   ├── textAnalyzer.ts  # 文本分析工具
│   ├── validators.ts    # 表单验证工具
│   └── formatters.ts    # 数据格式化工具
├── hooks/                # 自定义Hooks目录
│   ├── useAuth.ts       # 认证相关Hook
│   ├── useDetection.ts  # 检测相关Hook
│   └── useProgress.ts   # 进度相关Hook
├── App.tsx              # 应用根组件
├── main.tsx            # 应用入口
└── index.css          # 全局样式
```

### 2.2 目录设计原则

组件目录按照功能域进行划分，每个功能域下包含该域的所有组件。页面目录采用扁平化结构，通过路由配置实现页面组织。服务层采用单文件多类的方式，将相关的Mock服务聚合在一起，便于管理和维护。状态管理目录采用Zustand推荐的单一Store设计原则，每个Store负责管理单一功能域的状态。

## 3. 类型定义

### 3.1 用户相关类型

用户类型定义包含个人用户和机构用户两种类型，通过`userType`字段进行区分。用户角色分为普通用户、认证用户和管理员三种，不同角色对应不同的功能权限。用户的统计数据通过嵌套的`stats`对象进行管理，包括检测总数、平均AIGC率、连续天数等关键指标。

```typescript
// 用户角色枚举
type UserRole = 'normal' | 'verified' | 'admin';

// 用户类型枚举
type UserType = 'personal' | 'institutional';

// 机构类型枚举
type InstitutionType = 'journal' | 'university' | 'research' | 'other';

// 用户统计数据接口
interface UserStats {
  totalDetections: number;      // 总检测次数
  totalPapers: number;          // 总论文数
  avgAigcRate: number;          // 平均AIGC率
  currentStreak: number;        // 当前连续天数
  longestStreak: number;         // 最长连续天数
  weeklyDetections: number[];    // 周检测次数
}

// 用户信息接口
interface User {
  id: string;
  email: string;
  nickname: string;
  phone?: string;
  userType: UserType;
  institutionType?: InstitutionType;
  institutionName?: string;
  researchField?: string;
  role: UserRole;
  avatar?: string;
  achievements: string[];       // 已解锁成就ID列表
  stats: UserStats;
  createdAt: Date;
  lastLoginAt: Date;
}
```

### 3.2 检测相关类型

检测级别分为初级筛查、标准检测和深度检测三种，不同级别对应不同的检测深度和处理时间。论文状态用于追踪论文的处理进度，包括待处理、处理中、已完成和失败四种状态。学科类型支持理工科、人文社科、医学、法学和其他五个分类，每个学科采用不同的检测阈值和特征库。

```typescript
// 检测级别枚举
type DetectionLevel = 'basic' | 'standard' | 'deep';

// 风险等级枚举
type RiskLevel = 'low' | 'medium' | 'high';

// 学科类型枚举
type SubjectType = 'science' | 'humanities' | 'medicine' | 'law' | 'other';

// 论文状态枚举
type PaperStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 论文信息接口
interface Paper {
  id: string;
  userId: string;
  title: string;
  abstract?: string;
  content: string;
  wordCount: number;
  subject: SubjectType;
  detectionLevel: DetectionLevel;
  status: PaperStatus;
  version: number;              // 版本号，每次修改后递增
  createdAt: Date;
  updatedAt: Date;
}

// 段落检测结果接口
interface ParagraphResult {
  index: number;                 // 段落索引
  content: string;               // 段落内容
  startChar: number;             // 开始字符位置
  endChar: number;               // 结束字符位置
  aigcProbability: number;       // AIGC概率（0-100）
  riskLevel: RiskLevel;          // 风险等级
  issues: DetectionIssue[];       // 检测到的问题
}

// 检测问题详情接口
interface DetectionIssue {
  type: 'ai_pattern' | 'logic_flaw' | 'rewrite_trace' | 'citation_error';
  description: string;           // 问题描述
  position: { start: number; end: number }; // 位置范围
  suggestion?: string;            // 修改建议
  confidence: number;            // 置信度（0-1）
}

// 文本指纹分析接口
interface TextFingerprint {
  highFreqWordChains: WordChain[];
  punctuationPatterns: PunctuationPattern[];
  rareCollocation: Collocation[];
  aiCommonPatterns: AIPattern[];
}

// 词链接口
interface WordChain {
  words: string[];
  frequency: number;
  position: number;
}

// 标点模式接口
interface PunctuationPattern {
  pattern: string;
  frequency: number;
  isAiTypical: boolean;
}

// 搭配接口
interface Collocation {
  words: [string, string];
  frequency: number;
  rarity: number;               // 罕见程度（0-1）
}

// AI典型模式接口
interface AIPattern {
  pattern: string;
  matchedText: string;
  position: number;
  confidence: number;
}

// 逻辑漏洞接口
interface LogicFlaw {
  type: 'repetition' | 'causality' | 'citation' | 'circular' | 'generalization';
  paragraph: number;
  sentence: number;
  severity: RiskLevel;
  description: string;
  suggestion: string;
}

// 改写痕迹接口
interface RewriteTrace {
  originalText: string;
  paraphrasedText: string;
  method: 'synonym' | 'reordering' | 'voice' | 'split' | 'merge';
  confidence: number;
  position: { start: number; end: number };
}

// 引用检查接口
interface CitationCheck {
  citation: string;
  doi?: string;
  isValid: boolean;
  issues: CitationIssueType[];
  suggestedFix?: string;
}

// 引用问题类型
type CitationIssueType = 'doi_invalid' | 'doi_not_found' | 'inconsistent' | 'fake_reference';

// 章节统计接口
interface SectionStat {
  name: string;                 // 章节名称
  startIndex: number;           // 起始段落索引
  endIndex: number;             // 结束段落索引
  aigcRate: number;             // AIGC率
  paragraphCount: number;       // 段落数
  highRiskCount: number;        // 高风险段落数
}

// 修改建议接口
interface Suggestion {
  type: 'replace' | 'rewrite' | 'reference' | 'logic';
  targetText: string;
  suggestion: string;
  reason: string;
  priority: number;             // 优先级（1-5）
}

// 检测报告完整接口
interface DetectionReport {
  id: string;
  paperId: string;
  userId: string;
  overallAigcRate: number;      // 总体AIGC率
  paragraphResults: ParagraphResult[];
  fingerprintAnalysis: TextFingerprint;
  logicFlaws: LogicFlaw[];
  rewriteTraces: RewriteTrace[];
  citationChecks: CitationCheck[];
  sectionStats: SectionStat[];
  suggestions: Suggestion[];
  version: number;
  detectionLevel: DetectionLevel;
  subject: SubjectType;
  processingTime: number;        // 处理时间（毫秒）
  createdAt: Date;
  certificateCode?: string;     // 认证码
}
```

### 3.3 社区相关类型

社区功能支持帖子发布、评论互动和点赞操作。帖子按学科和类型进行分类，便于用户精准找到感兴趣的内容。帖子状态包括正常、精华和置顶三种，通过`isPinned`和`isFeatured`字段进行标识。

```typescript
// 帖子分类枚举
type PostCategory = 'technique' | 'discussion' | 'help' | 'sharing';

// 帖子状态接口
interface Post {
  id: string;
  userId: string;
  user: User;                   // 发布者信息
  title: string;
  content: string;
  category: PostCategory;
  subject?: SubjectType;
  likes: number;                // 点赞数
  comments: number;             // 评论数
  views: number;                // 浏览数
  isPinned: boolean;            // 是否置顶
  isFeatured: boolean;          // 是否精华
  tags: string[];              // 标签
  createdAt: Date;
  updatedAt: Date;
}

// 评论接口
interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;                   // 评论者信息
  content: string;
  likes: number;
  parentId?: string;            // 父评论ID，支持嵌套回复
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.4 成就相关类型

成就系统采用条件触发机制，通过`AchievementCondition`定义解锁条件。成就稀有度分为普通、稀有、史诗和传说四个等级，不同稀有度的成就对应不同的视觉展示效果。

```typescript
// 成就稀有度枚举
type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// 条件类型枚举
type ConditionType = 'aigc_rate' | 'streak' | 'detection_count' | 'citation_fix' | 'logic_check';

// 成就条件接口
interface AchievementCondition {
  type: ConditionType;
  threshold: number;            // 阈值
  timeframe?: 'total' | 'daily' | 'weekly' | 'monthly';
  subject?: SubjectType;        // 学科限定
}

// 成就定义接口
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;                 // 图标名称
  condition: AchievementCondition;
  rarity: AchievementRarity;
  points: number;              // 积分奖励
  createdAt: Date;
}

// 用户成就记录接口
interface UserAchievement {
  id: string;
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  progress: number;            // 当前进度
}
```

## 4. 服务层设计

### 4.1 Mock服务架构

服务层采用类封装的方式实现，每个服务类对应一个功能域。服务类内部维护模拟数据和状态，通过模拟的异步操作模拟真实API的响应延迟。所有服务类都支持通过依赖注入的方式获取其他服务实例，便于服务间的协作。

```typescript
// 服务基类
abstract class BaseService<T> {
  protected data: T[];
  protected storageKey: string;
  
  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.data = this.loadFromStorage();
  }
  
  protected loadFromStorage(): T[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  protected saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }
  
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 用户服务类
class MockUserService extends BaseService<User> {
  private static instance: MockUserService;
  
  private constructor() {
    super('zhenxie_users');
  }
  
  static getInstance(): MockUserService {
    if (!MockUserService.instance) {
      MockUserService.instance = new MockUserService();
    }
    return MockUserService.instance;
  }
  
  async login(email: string, password: string): Promise<User>;
  async register(data: RegisterData): Promise<User>;
  getCurrentUser(): User | null;
  logout(): void;
  async updateProfile(userId: string, data: Partial<User>): Promise<User>;
  async updateStats(userId: string, stats: Partial<UserStats>): Promise<User>;
}

// 检测服务类
class MockDetectionService extends BaseService<Paper> {
  private static instance: MockDetectionService;
  
  private constructor() {
    super('zhenxie_papers');
  }
  
  static getInstance(): MockDetectionService {
    if (!MockDetectionService.instance) {
      MockDetectionService.instance = new MockDetectionService();
    }
    return MockDetectionService.instance;
  }
  
  async submitPaper(paper: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>): Promise<Paper>;
  async processDetection(paperId: string, level: DetectionLevel): Promise<DetectionReport>;
  async getReports(userId: string): Promise<DetectionReport[]>;
  async getReport(reportId: string): Promise<DetectionReport | null>;
  async generateCertificate(reportId: string): Promise<string>;
  async analyzeFingerprint(text: string): Promise<TextFingerprint>;
  async checkLogic(text: string): Promise<LogicFlaw[]>;
  async checkCitations(text: string): Promise<CitationCheck[]>;
  async detectRewrite(original: string, text: string): Promise<RewriteTrace[]>;
}

// 社区服务类
class MockCommunityService extends BaseService<Post> {
  private static instance: MockCommunityService;
  
  private constructor() {
    super('zhenxie_posts');
  }
  
  static getInstance(): MockCommunityService {
    if (!MockCommunityService.instance) {
      MockCommunityService.instance = new MockCommunityService();
    }
    return MockCommunityService.instance;
  }
  
  async getPosts(filter?: PostFilter): Promise<Post[]>;
  async getPost(postId: string): Promise<Post | null>;
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  async updatePost(postId: string, data: Partial<Post>): Promise<Post>;
  async deletePost(postId: string): Promise<void>;
  async likePost(postId: string): Promise<number>;
  async getComments(postId: string): Promise<Comment[]>;
  async addComment(postId: string, content: string): Promise<Comment>;
  async deleteComment(commentId: string): Promise<void>;
}

// 成就服务类
class MockAchievementService extends BaseService<Achievement> {
  private static instance: MockAchievementService;
  
  private constructor() {
    super('zhenxie_achievements');
    this.initializeDefaultAchievements();
  }
  
  static getInstance(): MockAchievementService {
    if (!MockAchievementService.instance) {
      MockAchievementService.instance = new MockAchievementService();
    }
    return MockAchievementService.instance;
  }
  
  private initializeDefaultAchievements(): void;
  async getAchievements(): Promise<Achievement[]>;
  async getUserAchievements(userId: string): Promise<UserAchievement[]>;
  async checkAndUnlock(userId: string): Promise<Achievement[]>;
  async updateProgress(userId: string, condition: AchievementCondition, value: number): Promise<void>;
}
```

### 4.2 文本分析算法设计

文本分析采用多维度的特征提取策略，包括词频分析、句式结构分析、语义连贯性分析和AI模式匹配四个核心维度。通过对这些维度的综合评估，计算出文本的AIGC概率。

```typescript
// 词频分析器
class WordFrequencyAnalyzer {
  private aiTypicalWords = [
    '首先', '其次', '最后', '综上所述', '因此', '然而', 
    '值得注意的是', '众所周知', '不难发现', '由此可见',
    '进一步研究表明', '实验结果表明', '数据分析显示'
  ];
  
  analyze(text: string): {
    wordChains: WordChain[];
    aiTypicalCount: number;
    vocabularyRichness: number;
  } {
    const words = this.tokenize(text);
    const wordChains = this.extractWordChains(words, 3);
    const aiTypicalCount = this.countAiTypicalWords(text);
    const vocabularyRichness = this.calculateRichness(words);
    
    return { wordChains, aiTypicalCount, vocabularyRichness };
  }
  
  private tokenize(text: string): string[] {
    return text.match(/[\u4e00-\u9fa5]+/g) || [];
  }
  
  private extractWordChains(words: string[], length: number): WordChain[] {
    const chains: Map<string, number> = new Map();
    
    for (let i = 0; i <= words.length - length; i++) {
      const chain = words.slice(i, i + length).join('');
      chains.set(chain, (chains.get(chain) || 0) + 1);
    }
    
    return Array.from(chains.entries())
      .filter(([_, freq]) => freq >= 2)
      .map(([words, frequency]) => ({
        words: words.split(''),
        frequency,
        position: 0
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }
  
  private countAiTypicalWords(text: string): number {
    let count = 0;
    for (const word of this.aiTypicalWords) {
      const regex = new RegExp(word, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
    return count;
  }
  
  private calculateRichness(words: string[]): number {
    const unique = new Set(words).size;
    return words.length > 0 ? unique / words.length : 0;
  }
}

// 句式分析器
class SentencePatternAnalyzer {
  private aiTypicalPatterns = [
    /\首先[，,][^。]*[，,]/g,
    /\其次[，,][^。]*[，,]/g,
    /然而/g,
    /因此/g,
    /综上所述/g,
    /值得注意的是/g
  ];
  
  analyze(text: string): {
    avgSentenceLength: number;
    sentenceLengthVariance: number;
    aiPatternMatches: number;
    passiveVoiceRatio: number;
  } {
    const sentences = this.splitSentences(text);
    const lengths = sentences.map(s => s.length);
    const avgSentenceLength = this.mean(lengths);
    const sentenceLengthVariance = this.variance(lengths, avgSentenceLength);
    const aiPatternMatches = this.countPatternMatches(text);
    const passiveVoiceRatio = this.calculatePassiveRatio(text);
    
    return {
      avgSentenceLength,
      sentenceLengthVariance,
      aiPatternMatches,
      passiveVoiceRatio
    };
  }
  
  private splitSentences(text: string): string[] {
    return text.split(/[。！？]/).filter(s => s.trim().length > 0);
  }
  
  private mean(values: number[]): number {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }
  
  private variance(values: number[], mean: number): number {
    if (values.length === 0) return 0;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private countPatternMatches(text: string): number {
    let count = 0;
    for (const pattern of this.aiTypicalPatterns) {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    }
    return count;
  }
  
  private calculatePassiveRatio(text: string): number {
    const passiveMarkers = ['被', '由', '受到', '遭到'];
    let passiveCount = 0;
    let totalSentences = 0;
    
    const sentences = this.splitSentences(text);
    totalSentences = sentences.length;
    
    for (const sentence of sentences) {
      for (const marker of passiveMarkers) {
        if (sentence.includes(marker)) {
          passiveCount++;
          break;
        }
      }
    }
    
    return totalSentences > 0 ? passiveCount / totalSentences : 0;
  }
}

// AIGC概率计算器
class AIGCProbabilityCalculator {
  private wordAnalyzer = new WordFrequencyAnalyzer();
  private sentenceAnalyzer = new SentencePatternAnalyzer();
  
  calculate(paragraphs: string[]): ParagraphResult[] {
    return paragraphs.map((content, index) => {
      const wordAnalysis = this.wordAnalyzer.analyze(content);
      const sentenceAnalysis = this.sentenceAnalyzer.analyze(content);
      
      const probability = this.computeProbability(
        wordAnalysis,
        sentenceAnalysis
      );
      
      return {
        index,
        content,
        startChar: 0,
        endChar: content.length,
        aigcProbability: probability,
        riskLevel: this.getRiskLevel(probability),
        issues: this.extractIssues(wordAnalysis, sentenceAnalysis)
      };
    });
  }
  
  private computeProbability(
    wordAnalysis: ReturnType<WordFrequencyAnalyzer['analyze']>,
    sentenceAnalysis: ReturnType<SentencePatternAnalyzer['analyze']>
  ): number {
    const aiTypicalScore = Math.min(wordAnalysis.aiTypicalCount / 10, 1) * 30;
    const vocabularyScore = (1 - wordAnalysis.vocabularyRichness) * 20;
    const patternScore = Math.min(sentenceAnalysis.aiPatternMatches / 5, 1) * 25;
    const lengthScore = Math.min(Math.abs(sentenceAnalysis.avgSentenceLength - 25) / 50, 1) * 15;
    const passiveScore = sentenceAnalysis.passiveVoiceRatio * 10;
    
    return Math.round(aiTypicalScore + vocabularyScore + patternScore + lengthScore + passiveScore);
  }
  
  private getRiskLevel(probability: number): RiskLevel {
    if (probability < 30) return 'low';
    if (probability < 70) return 'medium';
    return 'high';
  }
  
  private extractIssues(
    wordAnalysis: ReturnType<WordFrequencyAnalyzer['analyze']>,
    sentenceAnalysis: ReturnType<SentencePatternAnalyzer['analyze']>
  ): DetectionIssue[] {
    const issues: DetectionIssue[] = [];
    
    if (wordAnalysis.aiTypicalCount > 5) {
      issues.push({
        type: 'ai_pattern',
        description: '检测到较多AI典型词汇',
        position: { start: 0, end: 0 },
        confidence: 0.8
      });
    }
    
    if (sentenceAnalysis.aiPatternMatches > 3) {
      issues.push({
        type: 'ai_pattern',
        description: '存在AI典型句式模式',
        position: { start: 0, end: 0 },
        confidence: 0.75
      });
    }
    
    if (wordAnalysis.vocabularyRichness < 0.3) {
      issues.push({
        type: 'ai_pattern',
        description: '词汇多样性较低',
        position: { start: 0, end: 0 },
        confidence: 0.7
      });
    }
    
    return issues;
  }
}
```

## 5. 状态管理设计

### 5.1 用户状态管理

用户状态管理采用Zustand的持久化中间件，用户登录状态和基本信息存储在LocalStorage中，支持页面刷新后保持登录状态。状态管理包含认证状态、用户信息和权限检查三个核心功能。

```typescript
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  checkAuth: () => boolean;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userService = MockUserService.getInstance();
          const user = await userService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: '登录失败', isLoading: false });
          return false;
        }
      },
      
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const userService = MockUserService.getInstance();
          const user = await userService.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: '注册失败', isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        const userService = MockUserService.getInstance();
        userService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      updateUser: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },
      
      checkAuth: () => {
        const userService = MockUserService.getInstance();
        const user = userService.getCurrentUser();
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'zhenxie-user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);
```

### 5.2 检测状态管理

检测状态管理负责管理论文提交、检测进度和报告生成的全流程。状态包含当前论文信息、检测进度、生成的报告和历史记录四个维度。

```typescript
interface DetectionState {
  currentPaper: Paper | null;
  currentReport: DetectionReport | null;
  reports: DetectionReport[];
  isDetecting: boolean;
  progress: number;
  error: string | null;
  
  submitPaper: (paper: Omit<Paper, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Paper>;
  startDetection: (paperId: string, level: DetectionLevel) => Promise<DetectionReport>;
  setProgress: (progress: number) => void;
  loadReports: (userId: string) => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
  generateCertificate: (reportId: string) => Promise<string>;
  reset: () => void;
}

const useDetectionStore = create<DetectionState>()(
  persist(
    (set, get) => ({
      currentPaper: null,
      currentReport: null,
      reports: [],
      isDetecting: false,
      progress: 0,
      error: null,
      
      submitPaper: async (paperData) => {
        set({ isLoading: true, error: null });
        try {
          const detectionService = MockDetectionService.getInstance();
          const paper = await detectionService.submitPaper(paperData);
          set({ currentPaper: paper, isLoading: false });
          return paper;
        } catch (error) {
          set({ error: '提交失败', isLoading: false });
          throw error;
        }
      },
      
      startDetection: async (paperId, level) => {
        set({ isDetecting: true, progress: 0, error: null });
        try {
          const detectionService = MockDetectionService.getInstance();
          
          // 模拟检测进度
          const progressInterval = setInterval(() => {
            const currentProgress = get().progress;
            if (currentProgress < 90) {
              set({ progress: currentProgress + 10 });
            }
          }, 500);
          
          const report = await detectionService.processDetection(paperId, level);
          
          clearInterval(progressInterval);
          set({ progress: 100, currentReport: report, isDetecting: false });
          
          // 更新历史记录
          const reports = get().reports;
          set({ reports: [report, ...reports] });
          
          return report;
        } catch (error) {
          set({ error: '检测失败', isDetecting: false });
          throw error;
        }
      },
      
      setProgress: (progress) => set({ progress }),
      
      loadReports: async (userId) => {
        try {
          const detectionService = MockDetectionService.getInstance();
          const reports = await detectionService.getReports(userId);
          set({ reports });
        } catch (error) {
          set({ error: '加载失败' });
        }
      },
      
      loadReport: async (reportId) => {
        try {
          const detectionService = MockDetectionService.getInstance();
          const report = await detectionService.getReport(reportId);
          set({ currentReport: report });
        } catch (error) {
          set({ error: '加载失败' });
        }
      },
      
      generateCertificate: async (reportId) => {
        try {
          const detectionService = MockDetectionService.getInstance();
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
      })
    }),
    {
      name: 'zhenxie-detection-storage',
      partialize: (state) => ({ reports: state.reports })
    }
  )
);
```

### 5.3 社区状态管理

社区状态管理处理帖子列表、评论和用户互动功能。状态包含帖子列表、当前帖子、评论列表、筛选条件和分页信息。

```typescript
interface CommunityState {
  posts: Post[];
  currentPost: Post | null;
  comments: Comment[];
  filter: PostFilter;
  isLoading: boolean;
  error: string | null;
  
  loadPosts: (filter?: PostFilter) => Promise<void>;
  loadPost: (postId: string) => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>;
  likePost: (postId: string) => Promise<void>;
  loadComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  setFilter: (filter: Partial<PostFilter>) => void;
}

interface PostFilter {
  category?: PostCategory;
  subject?: SubjectType;
  keyword?: string;
  sortBy: 'latest' | 'popular' | 'most_commented';
}
```

### 5.4 成就状态管理

成就状态管理追踪用户成就的解锁进度和已获得成就列表。状态包含成就定义列表、用户成就记录和当前进度信息。

```typescript
interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  
  loadAchievements: () => Promise<void>;
  loadUserAchievements: (userId: string) => Promise<void>;
  updateProgress: (userId: string, condition: AchievementCondition, value: number) => Promise<void>;
  checkAndUnlock: (userId: string) => Promise<Achievement[]>;
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
}
```

## 6. 组件架构

### 6.1 布局组件

布局组件提供应用的整体框架结构，包括顶部导航栏和内容容器。导航栏根据用户登录状态动态显示不同的功能入口。

```typescript
// Header组件结构
const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-bold text-gray-900">
              真写·检测
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/detect" className={navClass}>
              论文检测
            </NavLink>
            <NavLink to="/progress" className={navClass}>
              进度追踪
            </NavLink>
            <NavLink to="/community" className={navClass}>
              社区
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/profile" className={navClass}>
                个人中心
              </NavLink>
            )}
          </nav>
          
          {/* Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.nickname}
                </span>
                <button onClick={onLogout} className="btn-secondary">
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary">
                  登录
                </Link>
                <Link to="/register" className="btn-primary">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

### 6.2 检测组件

检测组件是平台的核心功能组件，包括文件上传、热力图展示和报告生成三个主要部分。热力图组件以颜色编码的方式直观展示论文各段落的AIGC概率。

```typescript
// HeatmapViewer组件结构
const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ 
  paragraphResults 
}) => {
  return (
    <div className="space-y-4">
      {paragraphResults.map((result, index) => (
        <div 
          key={index}
          className="relative group cursor-pointer"
        >
          <div 
            className={cn(
              "absolute inset-0 rounded-lg opacity-20 transition-opacity",
              getRiskColor(result.riskLevel)
            )}
          />
          <div className="relative p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-gray-500">
                段落 {index + 1}
              </span>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                getRiskBadgeColor(result.riskLevel)
              )}>
                {result.aigcProbability}% AI
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {result.content}
            </p>
            {result.issues.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {result.issues.map((issue, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded"
                    >
                      {issue.description}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// 辅助函数
const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
  }
};

const getRiskBadgeColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low': return 'bg-green-100 text-green-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'high': return 'bg-red-100 text-red-700';
  }
};
```

### 6.3 进度追踪组件

进度追踪组件采用多种图表形式展示用户的检测历史和进步趋势。雷达图展示多维度能力，曲线图展示AIGC率变化趋势，日历热力图展示打卡记录。

```typescript
// 雷达图组件
const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="AIGC率"
            dataKey="value"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 曲线图组件
const AIGCTrendChart: React.FC<AIGCTrendChartProps> = ({ 
  data, 
  onVersionSelect 
}) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data} onClick={(e) => onVersionSelect?.(e.activePayload?.[0]?.payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="version" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value}%`, 'AIGC率']}
          />
          <Line 
            type="monotone" 
            dataKey="aigcRate" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 日历热力图组件
const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ 
  data, 
  onDayClick 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const days = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-medium">
          {format(currentMonth, 'yyyy年MM月')}
        </h3>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map(day => {
          const dayData = data.find(d => isSameDay(d.date, day));
          return (
            <button
              key={day.toISOString()}
              onClick={() => dayData && onDayClick?.(dayData)}
              className={cn(
                "aspect-square rounded flex items-center justify-center text-sm transition-all",
                getHeatmapColor(dayData?.count || 0),
                dayData ? "hover:ring-2 hover:ring-primary cursor-pointer" : "cursor-default"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
```

### 6.4 成就徽章组件

成就徽章组件展示用户已解锁和未解锁的成就，支持稀有度等级的颜色区分和动画效果。

```typescript
const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  isUnlocked,
  progress 
}) => {
  const [showDetail, setShowDetail] = useState(false);
  
  const getRarityColor = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-amber-400 to-amber-500';
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDetail(true)}
        className={cn(
          "relative w-20 h-20 rounded-xl flex items-center justify-center transition-transform hover:scale-105",
          isUnlocked 
            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg`
            : "bg-gray-200"
        )}
      >
        <span className="text-3xl">{achievement.icon}</span>
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
      </button>
      
      <p className={cn(
        "mt-2 text-xs text-center font-medium",
        isUnlocked ? "text-gray-900" : "text-gray-500"
      )}>
        {achievement.name}
      </p>
      
      {!isUnlocked && progress !== undefined && (
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
```

## 7. 页面路由设计

### 7.1 路由配置

应用采用React Router v6的声明式路由配置，所有路由定义集中管理，便于维护和扩展。路由分为公共路由和受保护路由两类，受保护路由需要用户登录后才能访问。

```typescript
const AppRouter: React.FC = () => {
  const { isAuthenticated } = useUserStore();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/detect" element={<DetectPage />} />
          <Route path="/detect/:paperId" element={<DetectPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/achievements" element={<AchievementsPage />} />
          <Route path="/profile/reports" element={<ReportsPage />} />
          <Route path="/report/:reportId" element={<ReportDetailPage />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// 保护路由组件
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  isAuthenticated 
}) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
```

### 7.2 页面组件清单

| 页面名称 | 路由路径 | 访问权限 | 功能描述 |
|---------|---------|---------|---------|
| 首页 | / | 公开 | 产品介绍、快速入口 |
| 登录页 | /login | 公开 | 用户登录 |
| 注册页 | /register | 公开 | 用户注册 |
| 检测页 | /detect | 登录 | 论文上传与检测 |
| 检测详情 | /detect/:paperId | 登录 | 查看检测报告 |
| 进度追踪 | /progress | 登录 | 查看历史与趋势 |
| 社区首页 | /community | 登录 | 浏览帖子列表 |
| 个人中心 | /profile | 登录 | 用户信息管理 |
| 成就页面 | /profile/achievements | 登录 | 查看成就徽章 |
| 报告列表 | /profile/reports | 登录 | 查看历史报告 |
| 报告详情 | /report/:reportId | 登录 | 查看报告详情 |

## 8. 数据持久化策略

### 8.1 LocalStorage键值设计

采用命名空间隔离不同功能域的数据，避免键名冲突。数据存储采用JSON序列化格式，支持复杂数据结构的持久化。

```typescript
const STORAGE_KEYS = {
  USER: 'zhenxie_user_storage',
  DETECTION: 'zhenxie_detection_storage',
  COMMUNITY: 'zhenxie_community_storage',
  ACHIEVEMENT: 'zhenxie_achievement_storage',
  PREFERENCES: 'zhenxie_preferences'
} as const;

const PREFERENCES_DEFAULTS = {
  theme: 'light',
  language: 'zh-CN',
  detectionLevel: 'standard',
  defaultSubject: 'science',
  notifications: {
    email: true,
    browser: true
  }
};
```

### 8.2 数据迁移策略

版本控制字段用于标识数据结构的变化，当数据结构升级时通过版本对比执行迁移逻辑。迁移函数按版本顺序执行，确保数据逐步更新到最新版本。

```typescript
interface StorageVersion {
  version: number;
  migrate: (data: any) => any;
}

const migrations: StorageVersion[] = [
  {
    version: 1,
    migrate: (data) => {
      // v1 -> v2 迁移逻辑
      return { ...data, v2Field: 'default' };
    }
  },
  {
    version: 2,
    migrate: (data) => {
      // v2 -> v3 迁移逻辑
      return { ...data, v3Field: 'default' };
    }
  }
];

const runMigrations = (storedData: any, currentVersion: number): any => {
  let data = storedData;
  
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      data = migration.migrate(data);
    }
  }
  
  return data;
};
```

## 9. 性能优化策略

### 9.1 代码分割

采用动态导入的方式实现路由级别的代码分割，减少首屏加载时间。每个页面组件作为独立的代码块，只有在用户访问时才加载对应资源。

```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const DetectPage = lazy(() => import('./pages/DetectPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// 路由配置
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/detect" element={<DetectPage />} />
    {/* ... */}
  </Routes>
</Suspense>
```

### 9.2 状态优化

使用Zustand的selector机制避免不必要的组件重渲染。对于派生状态，通过计算属性函数缓存结果，只在依赖数据变化时重新计算。

```typescript
// 选择器优化
const useUserStats = () => {
  return useUserStore(state => ({
    totalPapers: state.user?.stats.totalPapers || 0,
    avgAigcRate: state.user?.stats.avgAigcRate || 0,
    currentStreak: state.user?.stats.currentStreak || 0
  }));
};

// 计算属性优化
const useDetectionStats = () => {
  const reports = useDetectionStore(state => state.reports);
  
  return useMemo(() => ({
    totalDetections: reports.length,
    avgAigcRate: reports.length > 0 
      ? reports.reduce((sum, r) => sum + r.overallAigcRate, 0) / reports.length
      : 0,
    lowestAigcRate: reports.length > 0
      ? Math.min(...reports.map(r => r.overallAigcRate))
      : 0
  }), [reports]);
};
```

### 9.3 渲染优化

长列表采用虚拟滚动技术，只渲染可视区域内的元素。对于数据量较大的组件，使用React.memo包装，避免不必要的重渲染。

```typescript
// 帖子列表优化
const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          rowCount={posts.length}
          rowHeight={120}
          rowRenderer={({ index, key, style }) => (
            <PostCard 
              key={key}
              post={posts[index]}
              style={style}
            />
          )}
        />
      )}
    </AutoSizer>
  );
};

// 组件记忆化
const PostCard = React.memo<PostCardProps>(({ post }) => {
  return (
    <div className="p-4 bg-white rounded-lg border">
      {/* ... */}
    </div>
  );
});
```

## 10. 错误处理机制

### 10.1 错误边界

全局错误边界组件捕获渲染阶段的JavaScript错误，防止错误传播导致整个应用崩溃。错误状态通过UI友好方式展示，引导用户进行正确操作。

```typescript
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-medium text-gray-900 mb-2">
              页面加载失败
            </h1>
            <p className="text-gray-600 mb-6">
              请刷新页面重试，或联系客服获取帮助
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 10.2 API错误处理

服务层统一封装错误处理逻辑，将各种错误类型转换为用户友好的提示信息。错误分类包括网络错误、认证错误、验证错误和服务器错误四种类型。

```typescript
class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

const handleServiceError = (error: unknown): string => {
  if (error instanceof ServiceError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return '网络连接失败，请检查您的网络设置';
      case 'AUTH_ERROR':
        return '登录已过期，请重新登录';
      case 'VALIDATION_ERROR':
        return error.message || '输入信息有误，请检查后重试';
      case 'SERVER_ERROR':
        return '服务器繁忙，请稍后再试';
      default:
        return '操作失败，请重试';
    }
  }
  
  return '发生未知错误，请联系客服';
};
```

## 11. 安全考虑

### 11.1 XSS防护

所有用户输入的内容在渲染前进行HTML转义处理，防止恶意脚本注入。富文本内容采用白名单机制，只允许安全的HTML标签和属性。

```typescript
import DOMPurify from 'dompurify';

const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};
```

### 11.2 CSRF防护

状态管理中的关键操作添加请求来源验证，阻止跨站请求伪造攻击。Token验证机制确保请求来自合法的应用页面。

```typescript
const validateRequest = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};

const generateToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
```

### 11.3 数据隐私

用户数据采用加密存储策略，敏感信息在本地存储前进行加密处理。数据删除支持彻底清除，确保用户注销后个人信息被完全移除。

```typescript
const secureStorage = {
  set: (key: string, value: any) => {
    const encrypted = btoa(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  
  get: (key: string): any => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return JSON.parse(atob(encrypted));
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};
```

## 12. 测试策略

### 12.1 单元测试

核心业务逻辑采用Jest进行单元测试，覆盖文本分析算法、状态管理函数和工具函数。测试覆盖率目标为核心模块80%以上。

```typescript
describe('WordFrequencyAnalyzer', () => {
  it('should count AI typical words correctly', () => {
    const analyzer = new WordFrequencyAnalyzer();
    const text = '首先，我们需要分析这个问题。其次，提出了解决方案。最后，总结全文。';
    const result = analyzer.analyze(text);
    
    expect(result.aiTypicalCount).toBe(3);
  });
  
  it('should calculate vocabulary richness', () => {
    const analyzer = new WordFrequencyAnalyzer();
    const text = '人工智能机器学习深度学习神经网络';
    const result = analyzer.analyze(text);
    
    expect(result.vocabularyRichness).toBe(1);
  });
});
```

### 12.2 集成测试

页面级别的集成测试验证组件间的交互正确性，使用React Testing Library模拟用户行为并验证预期结果。

```typescript
describe('DetectPage', () => {
  it('should submit paper successfully', async () => {
    render(<DetectPage />);
    
    const textarea = screen.getByPlaceholderText('请粘贴论文内容');
    const submitButton = screen.getByText('开始检测');
    
    fireEvent.change(textarea, { 
      target: { value: '这是测试论文内容。' } 
    });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('检测完成')).toBeInTheDocument();
    });
  });
});
```

### 12.3 E2E测试

端到端测试使用Playwright模拟真实用户流程，验证从登录到检测完成的完整用户旅程。

```typescript
describe('Complete Detection Flow', () => {
  it('should complete detection from login to report', async () => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/detect');
    
    await page.fill('[data-testid="paper-content"]', mockPaperContent);
    await page.click('[data-testid="start-detection"]');
    
    await page.waitForSelector('[data-testid="detection-complete"]');
    await expect(page.locator('[data-testid="aigc-rate"]')).toBeVisible();
  });
});
```
