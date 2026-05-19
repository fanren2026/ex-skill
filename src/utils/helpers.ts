export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'hard':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return '入门';
    case 'medium':
      return '进阶';
    case 'hard':
      return '高级';
    default:
      return difficulty;
  }
};

export const getLevelLabel = (level: string): string => {
  switch (level) {
    case 'basic':
      return '基础蒸馏';
    case 'advanced':
      return '进阶提升';
    case 'expert':
      return '高阶精通';
    default:
      return level;
  }
};

export const getLevelColor = (level: string): string => {
  switch (level) {
    case 'basic':
      return 'from-blue-500 to-blue-600';
    case 'advanced':
      return 'from-purple-500 to-purple-600';
    case 'expert':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export const getModuleTypeLabel = (type: string): string => {
  switch (type) {
    case 'knowledge':
      return '核心知识';
    case 'case':
      return '实操案例';
    case 'error':
      return '错题复盘';
    case 'practice':
      return '技能演练';
    default:
      return type;
  }
};

export const getModuleTypeColor = (type: string): string => {
  switch (type) {
    case 'knowledge':
      return 'bg-blue-500';
    case 'case':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'practice':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateOverallProgress = (progress: Record<string, { progress: number }>): number => {
  if (Object.keys(progress).length === 0) return 0;
  const total = Object.values(progress).reduce((sum, item) => sum + item.progress, 0);
  return Math.round(total / Object.keys(progress).length);
};

export const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    career: '职场核心技能',
    general: '通用能力',
    technical: '专业技术'
  };
  return categories[categoryId] || categoryId;
};