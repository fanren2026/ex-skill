// 用户相关类型
export type UserRole = 'normal' | 'verified' | 'admin';
export type UserType = 'personal' | 'institutional';
export type InstitutionType = 'journal' | 'university' | 'research' | 'other';

export interface UserStats {
  totalDetections: number;
  totalPapers: number;
  avgAigcRate: number;
  currentStreak: number;
  longestStreak: number;
  weeklyDetections: number[];
}

export interface User {
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
  achievements: string[];
  stats: UserStats;
  createdAt: string;
  lastLoginAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  phone?: string;
  userType: UserType;
  institutionType?: InstitutionType;
  institutionName?: string;
  researchField?: string;
}

// 检测相关类型
export type DetectionLevel = 'basic' | 'standard' | 'deep';
export type RiskLevel = 'low' | 'medium' | 'high';
export type SubjectType = 'science' | 'humanities' | 'medicine' | 'law' | 'other';
export type PaperStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Paper {
  id: string;
  userId: string;
  title: string;
  abstract?: string;
  content: string;
  wordCount: number;
  subject: SubjectType;
  detectionLevel: DetectionLevel;
  status: PaperStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DetectionIssue {
  type: 'ai_pattern' | 'logic_flaw' | 'rewrite_trace' | 'citation_error';
  description: string;
  position: { start: number; end: number };
  suggestion?: string;
  confidence: number;
}

export interface ParagraphResult {
  index: number;
  content: string;
  startChar: number;
  endChar: number;
  aigcProbability: number;
  riskLevel: RiskLevel;
  issues: DetectionIssue[];
}

export interface WordChain {
  words: string[];
  frequency: number;
  position: number;
}

export interface PunctuationPattern {
  pattern: string;
  frequency: number;
  isAiTypical: boolean;
}

export interface Collocation {
  words: [string, string];
  frequency: number;
  rarity: number;
}

export interface AIPattern {
  pattern: string;
  matchedText: string;
  position: number;
  confidence: number;
}

export interface TextFingerprint {
  highFreqWordChains: WordChain[];
  punctuationPatterns: PunctuationPattern[];
  rareCollocation: Collocation[];
  aiCommonPatterns: AIPattern[];
}

export type LogicFlawType = 'repetition' | 'causality' | 'citation' | 'circular' | 'generalization';

export interface LogicFlaw {
  type: LogicFlawType;
  paragraph: number;
  sentence: number;
  severity: RiskLevel;
  description: string;
  suggestion: string;
}

export type RewriteMethod = 'synonym' | 'reordering' | 'voice' | 'split' | 'merge';

export interface RewriteTrace {
  originalText: string;
  paraphrasedText: string;
  method: RewriteMethod;
  confidence: number;
  position: { start: number; end: number };
}

export type CitationIssueType = 'doi_invalid' | 'doi_not_found' | 'inconsistent' | 'fake_reference';

export interface CitationCheck {
  citation: string;
  doi?: string;
  isValid: boolean;
  issues: CitationIssueType[];
  suggestedFix?: string;
}

export interface SectionStat {
  name: string;
  startIndex: number;
  endIndex: number;
  aigcRate: number;
  paragraphCount: number;
  highRiskCount: number;
}

export type SuggestionType = 'replace' | 'rewrite' | 'reference' | 'logic';

export interface Suggestion {
  type: SuggestionType;
  targetText: string;
  suggestion: string;
  reason: string;
  priority: number;
}

export interface DetectionReport {
  id: string;
  paperId: string;
  userId: string;
  overallAigcRate: number;
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
  processingTime: number;
  createdAt: string;
  certificateCode?: string;
}

// 社区相关类型
export type PostCategory = 'technique' | 'discussion' | 'help' | 'sharing';

export interface Post {
  id: string;
  userId: string;
  user: User;
  title: string;
  content: string;
  category: PostCategory;
  subject?: SubjectType;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  likes: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostFilter {
  category?: PostCategory;
  subject?: SubjectType;
  keyword?: string;
  sortBy: 'latest' | 'popular' | 'most_commented';
}

// 成就相关类型
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ConditionType = 'aigc_rate' | 'streak' | 'detection_count' | 'citation_fix' | 'logic_check';

export interface AchievementCondition {
  type: ConditionType;
  threshold: number;
  timeframe?: 'total' | 'daily' | 'weekly' | 'monthly';
  subject?: SubjectType;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  rarity: AchievementRarity;
  points: number;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  userId: string;
  unlockedAt: string;
  progress: number;
}

// 进度追踪相关类型
export interface DailyDetection {
  date: string;
  count: number;
  avgAigcRate: number;
}

export interface SubjectAIGCData {
  subject: SubjectType;
  value: number;
}

export interface VersionComparison {
  version: number;
  aigcRate: number;
  date: string;
}
