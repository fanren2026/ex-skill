# SkillDistill - 智能蒸馏学习平台设计规范

## 1. 概念与愿景

**产品定位**: SkillDistill 是一个创新的在线学习平台，通过"知识蒸馏"理念，帮助用户在海量信息中提炼核心技能，实现高效学习。平台摒弃冗余知识，聚焦精华内容，让学习者能够快速掌握职场核心能力。

**核心价值**: 
- 高效 - 去除冗余，直击核心
- 精炼 - 层层递进，持续深化
- 个性化 - 因材施教，定制路径
- 社区化 - 交流互助，共同成长

**设计哲学**: "像晶体一样成长" - 知识从混沌到有序，从粗糙到精纯，最终形成完美的知识晶体。

## 2. 设计语言

### 美学方向
- **主题**: "知识晶体" (Knowledge Crystal)
- **灵感**: 钻石的切割、水晶的折射、星空的深邃
- **情绪**: 专业、智慧、探索、成就

### 色彩系统
```css
:root {
  /* 主色调 */
  --primary-deep: #0a1628;      /* 深空蓝 - 背景底色 */
  --primary-dark: #132743;       /* 暗夜蓝 - 次级背景 */
  --primary-light: #1e3a5f;      /* 午夜蓝 - 卡片背景 */
  
  /* 强调色 */
  --accent-crystal: #6366f1;    /* 水晶紫 - 主强调色 */
  --accent-glow: #818cf8;       /* 光晕紫 - 悬停效果 */
  --accent-gradient: #8b5cf6;   /* 渐变紫 - 渐变起点 */
  
  /* 成就金 */
  --gold-primary: #fbbf24;      /* 成就金 - 主要成就 */
  --gold-light: #fcd34d;        /* 亮金 - 悬停效果 */
  --gold-dark: #d97706;         /* 深金 - 边框高亮 */
  
  /* 成功色 */
  --success-green: #10b981;     /* 掌握绿 - 完成状态 */
  --success-light: #34d399;     /* 亮绿 - 进度条 */
  
  /* 警示色 */
  --warning-orange: #f59e0b;    /* 待强化橙 */
  --danger-red: #ef4444;        /* 薄弱环节红 */
  
  /* 文字色 */
  --text-primary: #f1f5f9;      /* 主文字 */
  --text-secondary: #94a3b8;    /* 次级文字 */
  --text-muted: #64748b;        /* 弱化文字 */
  
  /* 边框 */
  --border-subtle: rgba(99, 102, 241, 0.2);
  --border-glow: rgba(129, 140, 248, 0.4);
}
```

### 排版系统
```css
/* Display 字体 - 标题 */
font-family: 'Cinzel', serif;

/* Body 字体 - 正文 */
font-family: 'Noto Sans SC', sans-serif;

/* 代码/数字 */
font-family: 'JetBrains Mono', monospace;

/* 字号系统 */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### 空间系统
```css
/* 间距 */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */

/* 圆角 */
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
--radius-full: 9999px;  /* 圆形 */
```

### 动效系统
```css
/* 过渡 */
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
  }
}
```

## 3. 布局与结构

### 页面架构
1. **首页** (index.html) - 平台入口
   - 顶部导航栏（固定）
   - Hero 区域（价值主张）
   - 分层蒸馏体系展示
   - 沉浸式蒸馏模块
   - 个性化推荐
   - 底部页脚

2. **社区页面** (community.html)
   - 经验分享区
   - 问答讨论区
   - 热门话题
   - 蒸馏达人榜

3. **成就页面** (badges.html)
   - 成就徽章墙
   - 解锁进度
   - 勋章详情
   - 激励任务

4. **进度页面** (progress.html)
   - 个人蒸馏进度
   - 薄弱环节标记
   - 效果可视化
   - 学习统计

### 响应式策略
- **Desktop** (>1024px): 完整布局，3-4列网格
- **Tablet** (768px-1024px): 2列网格，简化导航
- **Mobile** (<768px): 单列布局，汉堡菜单

## 4. 功能模块

### 4.1 分层蒸馏体系

**基础入门蒸馏**
- 适用：零基础或初学者
- 内容：核心概念、基础技能、入门案例
- 目标：建立知识框架，掌握基本操作
- 时长：1-2周

**进阶提升蒸馏**
- 适用：有一定基础的学习者
- 内容：深度原理、实践技巧、高级应用
- 目标：深化理解，提升实战能力
- 时长：2-4周

**高阶精通蒸馏**
- 适用：专业从业者
- 内容：前沿技术、最佳实践、创新应用
- 目标：成为领域专家，培养创新能力
- 时长：1-3个月

### 4.2 沉浸式蒸馏模块

**核心知识点提炼**
- 精简的知识单元
- 可视化图解
- 关键要点标记
- 快速回顾卡片

**实操案例拆解**
- 真实场景模拟
- 步骤详解
- 代码示例
- 常见错误规避

**错题复盘蒸馏**
- 薄弱环节识别
- 错误原因分析
- 正确解法演示
- 巩固练习

**技能应用演练**
- 模拟任务挑战
- 实时反馈
- 效果评估
- 优化建议

### 4.3 蒸馏进度追踪

**数据存储**
- localStorage 持久化
- 技能完成状态
- 练习正确率
- 学习时长统计
- 成就解锁记录

**可视化展示**
- 进度环形图
- 学习热力图
- 技能雷达图
- 时间线视图

### 4.4 个性化推荐系统

**用户画像**
- 基础水平测试（简化问卷）
- 学习目标选择
- 时间可用性
- 兴趣偏好

**推荐算法**
- 基于level的难度适配
- 基于weakness的针对性推荐
- 基于progress的进度调整
- 基于community的热门推荐

### 4.5 社区交流系统

**讨论区**
- 按技能分类
- 发帖/回复功能
- 点赞/收藏
- 精华帖标记

**经验分享**
- 学习心得
- 技巧总结
- 资源推荐
- 成功案例

### 4.6 成就激励系统

**徽章类型**
- 入门徽章（完成第一个skill）
- 进阶徽章（完成进阶课程）
- 高手徽章（完成高阶课程）
- 全能徽章（掌握多个领域）
- 社区徽章（活跃交流）
- 坚持徽章（连续学习）
- 速度徽章（快速完成）
- 完美徽章（100%正确率）

**激励机制**
- 积分系统
- 等级提升
- 专属标识
- 进阶权限

## 5. 组件清单

### 导航栏 (Navbar)
- Logo + 平台名称
- 主导航链接
- 进度快捷入口
- 成就徽章展示
- 响应式汉堡菜单

### 英雄区域 (Hero)
- 主标题 + 副标题
- 行动按钮（开始蒸馏/查看更多）
- 装饰性水晶动画
- 统计数据展示

### 技能卡片 (SkillCard)
- 技能图标
- 技能名称
- 难度等级标签
- 完成进度条
- 预计时长
- 悬停展开详情

### 进度条 (ProgressBar)
- 环形进度
- 百分比显示
- 颜色渐变
- 动画效果

### 成就徽章 (Badge)
- 徽章图标
- 徽章名称
- 获得条件
- 解锁状态
- 悬停详情

### 社区帖子 (PostCard)
- 用户头像
- 用户名称
- 发布时间
- 帖子标题
- 内容摘要
- 互动数据（点赞/回复）
- 技能标签

### 统计面板 (StatCard)
- 统计数字
- 统计标签
- 变化趋势
- 图标装饰

### 模态框 (Modal)
- 标题栏
- 内容区
- 操作按钮
- 关闭按钮
- 背景遮罩

## 6. 技术实现

### 技术栈
- **HTML5**: 语义化标签
- **CSS3**: 现代布局、动画、响应式
- **JavaScript ES6+**: 原生JavaScript，无框架依赖
- **localStorage**: 数据持久化

### 数据结构

```javascript
// 用户学习数据
const userData = {
  profile: {
    name: "学习者",
    level: 1,
    totalPoints: 0,
    joinedDate: timestamp
  },
  skills: {
    // skill_id: {
    //   level: "beginner" | "intermediate" | "advanced",
    //   progress: 0-100,
    //   status: "not-started" | "in-progress" | "completed",
    //   lessonsCompleted: [],
    //   practiceScore: 0,
    //   weakAreas: [],
    //   lastAccessed: timestamp
    // }
  },
  badges: [],
  community: {
    posts: [],
    replies: [],
    likes: []
  },
  preferences: {
    targetSkills: [],
    availableTime: 0,
    learningGoal: ""
  }
};
```

### 关键功能实现

1. **进度追踪**: 使用 localStorage 实时保存，页面加载时恢复
2. **个性化推荐**: 基于用户level和weakness的简单推荐算法
3. **社区功能**: 使用 localStorage 模拟，支持发帖、回复、点赞
4. **成就系统**: 基于用户行为自动计算和奖励徽章
5. **无需登录**: 所有数据存储在浏览器本地

## 7. 质量标准

### 性能要求
- 首屏加载 < 2秒
- 交互响应 < 100ms
- 动画流畅 60fps

### 可用性要求
- 键盘可访问
- 屏幕阅读器友好
- 色彩对比度符合 WCAG AA
- 触摸友好的交互区域

### 浏览器支持
- Chrome/Edge (最新2个版本)
- Firefox (最新2个版本)
- Safari (最新2个版本)
- 移动端 Safari/Chrome
