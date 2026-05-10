# 真写·检测 - 学术论文AIGC率检测平台

## 1. 项目概述

### 项目名称与定位
- **产品名称**：真写·检测
- **产品定位**：专为高校、期刊、科研机构设计的学术论文AI生成内容（AIGC）检测平台
- **核心价值**：精准识别论文中的AI生成内容，帮助用户提升原创写作能力

### 目标用户
- **高校学生**：本科生、硕士研究生、博士研究生
- **高校教师**：教授、副教授、讲师
- **科研人员**：自由研究者、博士后
- **期刊编辑**：学术期刊编辑部人员
- **机构管理者**：大学教务处、研究生院管理人员

## 2. 设计规范

### 视觉风格
- **设计理念**：学术严谨与现代科技的融合
- **主色调**：
  - 原創信任蓝 `#2563EB`（主色调，代表真实、可靠）
  - 警示红 `#EF4444`（高概率AI）
  - 谨慎黄 `#F59E0B`（中等概率）
  - 安全绿 `#10B981`（低概率）
  - 学术深灰 `#1E293B`（文字、标题）
  - 纯净白 `#FFFFFF`（背景）
- **字体选择**：
  - 标题：思源宋体（SimSun Serif）或 Noto Serif SC（衬线体，体现学术性）
  - 正文：思源黑体或 Noto Sans SC（无衬线体，保证可读性）
  - 代码/数据：JetBrains Mono 或 Source Code Pro
- **布局特点**：
  - 清晰的网格系统，12列布局
  - 大量留白，突出内容层次
  - 卡片式信息展示
  - 数据可视化优先

### 交互设计
- **动画效果**：
  - 页面切换：淡入淡出，300ms ease-out
  - 数据加载：骨架屏 + 渐显
  - 检测进度：动态进度条 + 脉冲效果
  - 热力图：渐变色流动效果
- **反馈机制**：
  - 操作成功：绿色渐变 + 勾选动画
  - 警告提示：橙色闪烁 + 震动
  - 错误提示：红色渐变 + 抖动
- **响应式设计**：
  - 桌面端：1200px+ 完整功能展示
  - 平板端：768px-1199px 精简布局
  - 移动端：<768px 单列布局，核心功能优先

## 3. 功能模块详细设计

### 3.1 分级检测体系

#### 初级筛查
- **适用场景**：日常作业、课程论文、初审
- **检测速度**：< 30秒/万字
- **检测维度**：
  - 明显AI句式识别（如"首先...其次...最后..."过度使用）
  - 常见ChatGPT词汇检测
  - 基础语义重复检测
- **输出结果**：
  - 简单的高风险段落标注
  - AIGC概率百分比
  - 基础修改建议

#### 标准检测
- **适用场景**：普通期刊投稿、会议论文、课程论文
- **检测速度**：< 2分钟/万字
- **检测维度**：
  - 语义连贯性分析
  - 修辞模式识别
  - 句子复杂度统计
  - 词汇多样性评估
  - 段落结构分析
- **输出结果**：
  - 分段AIGC概率
  - 句子级别风险标注
  - 问题类型分类
  - 详细修改建议

#### 深度检测
- **适用场景**：学位论文、顶级会议、重要课题申报
- **检测速度**：< 5分钟/万字
- **检测维度**：
  - 同义词替换痕迹检测
  - 语序调整检测
  - 改写模式识别
  - 跨文档相似度分析
  - 模板句式检测
  - 深度语义分析
- **输出结果**：
  - 逐句AI贡献度
  - 改写痕迹可视化
  - 模板匹配报告
  - 深度修改方案

#### 学科定制分级
- **理工科**：
  - 检测阈值：更注重数据描述、方法表述
  - 特征库：STEM论文语料库
- **人文社科**：
  - 检测阈值：更注重论证逻辑、文献引用
  - 特征库：HSS论文语料库
- **医学**：
  - 检测阈值：更注重临床描述、数据引用
  - 特征库：医学论文语料库
- **法学**：
  - 检测阈值：更注重法条引用、案例分析
  - 特征库：法学论文语料库

### 3.2 互动式检测模块

#### 文本指纹分析（类比"单词记忆"）
- **功能描述**：记录论文中的高频词链、标点习惯、罕见搭配
- **工作原理**：
  - 建立用户写作指纹档案
  - 与AI常见库比对
  - 检测异常写作习惯变化
- **交互设计**：
  - 可视化词链展示
  - AI特征词高亮
  - 一键替换建议
- **数据结构**：
  ```typescript
  interface TextFingerprint {
    highFreqWordChains: WordChain[];
    punctuationPatterns: PunctuationPattern[];
    rareCollocation: Collocation[];
    aiCommonPatterns: string[];
  }
  ```

#### 逻辑漏洞扫描（类比"语法练习"）
- **功能描述**：识别论点重复、因果模糊、虚假引用等AI典型逻辑缺陷
- **检测类型**：
  - 论点重复：同一观点多次重复表述
  - 因果模糊：缺乏明确因果关系的结论
  - 虚假引用：不存在的文献或错误引用
  - 循环论证：论点和论据互为因果
  - 过度泛化：样本不足以支撑普遍结论
- **交互设计**：
  - 逻辑流程图展示
  - 漏洞位置标注
  - 修正建议弹窗
- **数据结构**：
  ```typescript
  interface LogicFlaw {
    type: 'repetition' | 'causality' | 'citation' | 'circular' | 'generalization';
    location: { paragraph: number; sentence: number };
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  }
  ```

#### 改写痕迹识别（类比"口语跟读"）
- **功能描述**：检测通过近义词替换、句式倒装等方式掩饰AI原始输出
- **检测方法**：
  - 语义等价变换检测
  - 句式结构相似度分析
  - 词汇替换模式识别
- **交互设计**：
  - 原文-改写对照展示
  - 改写手法标注
  - 原创度提升建议
- **数据结构**：
  ```typescript
  interface RewriteTrace {
    originalSentence: string;
    paraphrasedSentence: string;
    method: 'synonym' | 'reordering' | 'voice' | 'split' | 'merge';
    confidence: number;
  }
  ```

#### 文献合理性校验（类比"听力训练"）
- **功能描述**：自动核查参考文献的真实性、跨段落引用一致性、DOI有效性
- **校验内容**：
  - DOI格式验证
  - DOI实际存在性查询
  - 跨段落引用一致性
  - 年份与出版信息匹配
  - 作者信息核实
- **交互设计**：
  - 文献列表可视化
  - 问题文献高亮
  - DOI链接跳转
  - 自动修正建议
- **数据结构**：
  ```typescript
  interface CitationCheck {
    citation: string;
    doi?: string;
    isValid: boolean;
    issues: CitationIssue[];
    suggestedFix?: string;
  }
  ```

### 3.3 检测进度追踪功能

#### 全文热力图
- **展示形式**：
  - 颜色编码：红色（>70% AI）、黄色（30-70% AI）、绿色（<30% AI）
  - 逐句标注AI贡献度
  - 可点击查看详细分析
- **交互设计**：
  - 悬停显示概率
  - 点击展开详细
  - 支持导出热力图PDF

#### 版本对比曲线
- **数据展示**：
  - X轴：提交版本序号
  - Y轴：AIGC率百分比
  - 趋势线拟合
  - 关键节点标注
- **交互设计**：
  - 版本hover预览
  - 版本间差异对比
  - 进度激励提示（如"已降低15%！"）

#### 章节明细报告
- **章节划分**：
  - 摘要（Abstract）
  - 引言（Introduction）
  - 方法（Methods）
  - 结果（Results）
  - 讨论（Discussion）
  - 结论（Conclusion）
- **数据展示**：
  - 各章节独立AIGC率
  - 章节内高风险段落统计
  - 章节对比雷达图

#### 时间线回放
- **功能设计**：
  - 日历视图展示检测历史
  - 连续打卡激励
  - 原创提升路径可视化
- **交互设计**：
  - 日期选择查看历史
  - 进度动画展示
  - 成就解锁提示

### 3.4 用户注册登录系统

#### 个人账号
- **用户类型**：学生、教师、自由研究人员
- **功能权限**：
  - 保存历史检测报告
  - 个性化推荐
  - 成就系统
  - 社区参与
- **注册信息**：
  - 邮箱（必填）
  - 密码（必填，8位以上）
  - 昵称（必填）
  - 手机号（选填）
  - 机构类型（选填）
  - 研究领域（选填）

#### 机构账号
- **适用对象**：期刊编辑部、大学教务处
- **功能权限**：
  - 批量检测
  - 下载汇总报表
  - 团队管理
  - 统计分析
- **注册信息**：
  - 机构名称（必填）
  - 机构类型（必填）
  - 管理员邮箱（必填）
  - 管理员手机（必填）
  - 营业执照/证明（必填）

#### 权限分级
- **普通用户**：
  - 初级筛查
  - 标准检测（每月5次）
  - 查看个人报告
- **认证用户**：
  - 所有检测模式
  - 解锁高精度模式
  - 历史报告无限
  - 优先客服支持
- **管理用户**：
  - 查看全校/全刊统计
  - 批量操作权限
  - 数据导出权限
  - 用户管理权限

### 3.5 个性化检测路径推荐

#### 基于学科风格的建议
- **规则示例**：
  - 经济学论文：检测"因此""然而""综上所述"等AI模板词
  - 法学论文：检测法条引用格式规范性
  - 医学论文：检测医学术语使用准确性
- **推荐策略**：
  - 学科专属特征库匹配
  - 高频AI句式预警
  - 领域专业词汇引导

#### 基于写作水平的定制
- **新手用户**（首次使用或AIGC率持续>50%）：
  - 推荐：初级筛查 + 快速修改建议
  - 提供：写作模板和句式库
  - 引导：分步修改流程
- **进阶用户**（AIGC率30-50%）：
  - 推荐：标准检测 + 详细分析
  - 提供：个性化写作建议
  - 引导：薄弱环节强化
- **资深用户**（AIGC率<30%）：
  - 推荐：深度检测 + 原创替换库
  - 提供：顶刊风格参考
  - 引导：持续优化策略

#### 降AI指导路径
- **问题分类**：
  - 逻辑薄弱型
  - 用词单调型
  - 引用虚假型
  - 结构混乱型
- **任务推送**：
  - 根据检测结果自动生成修改任务
  - 类似学习计划的阶段性目标
  - 完成进度追踪

### 3.6 社区交流及成就激励系统

#### 检测讨论区
- **帖子类型**：
  - 降AI技巧分享
  - 模型识别特征讨论
  - 学科特定问题求助
  - 工具使用心得
- **功能特性**：
  - 按学科分类浏览
  - 关键词搜索
  - 高赞排序
  - 专家认证标识

#### 原创力榜单
- **排名维度**：
  - 连续低AIGC天数
  - 单篇论文最低AIGC率
  - 总检测论文数量
- **榜单类型**：
  - 全站总榜
  - 学科分类榜
  - 单位/机构榜
- **激励设计**：
  - 前10名头像框装饰
  - 周榜、月榜皇冠标识
  - 原创达人称号

#### 成就徽章系统
| 徽章名称 | 获得条件 | 设计要求 |
|---------|---------|---------|
| 句句真心 | 单篇论文人工撰写比例超90% | 金色羽毛笔图标 |
| 文献侦探 | 成功修正3条虚构参考文献 | 放大镜+书本图标 |
| 逻辑大师 | 连续5次检测无高频AI逻辑错误 | 齿轮+大脑图标 |
| 深度探索者 | 完成10次深度检测 | 显微镜图标 |
| 原创卫士 | 连续30天AIGC率低于5% | 盾牌+星星图标 |
| 学科专家 | 在某学科连续10篇<10% | 学科图标+皇冠 |

#### 公开认证报告
- **报告内容**：
  - 论文唯一识别码
  - 检测时间戳
  - AIGC率总览
  - 各章节明细
  - 检测方法说明
- **验证方式**：
  - 唯一码在线验证
  - 二维码扫描验证
  - PDF下载验证
- **应用场景**：
  - 期刊审稿辅助材料
  - 学位论文自检证明
  - 课题申报诚信附件

## 4. 用户流程设计

### 4.1 游客流程
1. 首页浏览 → 了解产品功能
2. 快速检测入口 → 体验初级筛查
3. 注册/登录 → 创建账号

### 4.2 普通用户流程
1. 登录 → 个人中心
2. 上传论文 → 选择检测级别
3. 开始检测 → 查看进度
4. 获取报告 → 阅读详情
5. 修改论文 → 重新检测
6. 保存报告 → 历史记录

### 4.3 认证用户流程
1. 登录 → 个人中心
2. 上传论文 → 选择检测级别+学科
3. 开始深度检测 → 查看详细报告
4. 获取降AI建议 → 实施修改
5. 生成认证报告 → 下载/分享

### 4.4 机构管理员流程
1. 登录 → 管理后台
2. 批量上传 → 设置检测参数
3. 查看汇总报告 → 数据分析
4. 导出数据 → 生成报表
5. 成员管理 → 权限分配

## 5. 数据模型设计

### 5.1 用户数据模型
```typescript
interface User {
  id: string;
  email: string;
  nickname: string;
  phone?: string;
  userType: 'personal' | 'institutional';
  institutionType?: string;
  researchField?: string;
  role: 'normal' | 'verified' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
  stats: {
    totalDetections: number;
    totalPapers: number;
    avgAigcRate: number;
    currentStreak: number;
    longestStreak: number;
  };
  achievements: string[];
}
```

### 5.2 论文数据模型
```typescript
interface Paper {
  id: string;
  userId: string;
  title: string;
  abstract?: string;
  content: string;
  wordCount: number;
  subject: 'science' | 'humanities' | 'medicine' | 'law' | 'other';
  detectionLevel: 'basic' | 'standard' | 'deep';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.3 检测报告数据模型
```typescript
interface DetectionReport {
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
  createdAt: Date;
  certificateCode?: string;
}

interface ParagraphResult {
  index: number;
  content: string;
  aigcProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  issues: string[];
}

interface SectionStat {
  name: string;
  aigcRate: number;
  paragraphCount: number;
  highRiskCount: number;
}
```

### 5.4 社区帖子数据模型
```typescript
interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'technique' | 'discussion' | 'help' | 'sharing';
  subject?: string;
  likes: number;
  comments: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
}
```

### 5.5 成就数据模型
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface AchievementCondition {
  type: 'aigc_rate' | 'streak' | 'detection_count' | 'citation_fix' | 'logic_check';
  threshold: number;
  timeframe?: 'total' | 'daily' | 'weekly' | 'monthly';
}
```

## 6. 页面结构

### 6.1 首页（HomePage）
- **Hero区域**：产品介绍、核心价值主张、快速检测入口
- **功能展示**：四大检测级别、互动模块、追踪功能
- **数据展示**：已检测论文数、用户数、准确率
- **底部导航**：产品介绍、用户案例、技术说明

### 6.2 检测页面（DetectPage）
- **上传区**：文件上传（支持PDF、Word）或文本粘贴
- **设置区**：检测级别选择、学科选择、高级选项
- **进度区**：实时检测进度条、当前步骤提示
- **结果区**：热力图展示、分段报告、下载选项

### 6.3 个人中心（ProfilePage）
- **用户信息**：头像、昵称、等级、积分
- **统计概览**：总检测数、平均AIGC率、连续天数
- **成就展示**：已获得徽章、进行中成就
- **历史记录**：检测报告列表、报告详情

### 6.4 进度追踪（ProgressPage）
- **雷达图**：多维度能力展示
- **趋势图**：AIGC率变化曲线
- **日历热力图**：每日检测打卡
- **章节明细**：各部分AIGC率对比

### 6.5 社区页面（CommunityPage）
- **分类导航**：按学科、按类型筛选
- **帖子列表**：排序、搜索、筛选
- **发帖功能**：创建新帖富文本编辑器
- **详情页**：帖子内容、评论、点赞

### 6.6 登录/注册页面（AuthPages）
- **登录页**：邮箱密码登录、验证码登录、机构登录
- **注册页**：用户类型选择、信息填写、协议确认
- **密码找回**：邮箱验证、重置密码

## 7. 技术栈

### 7.1 前端技术
- **框架**：React 18 + TypeScript
- **路由**：React Router v6
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **图表**：Recharts
- **图标**：Lucide React
- **日期处理**：date-fns

### 7.2 数据处理
- **文本分析**：正则表达式 + NLP特征提取
- **相似度计算**：余弦相似度、编辑距离
- **数据可视化**：Recharts、ECharts

### 7.3 存储方案
- **本地存储**：LocalStorage（用户偏好、历史记录）
- **状态持久化**：Zustand persist middleware

### 7.4 Mock服务
- **用户服务**：MockUserService
- **检测服务**：MockDetectionService
- **社区服务**：MockCommunityService
- **成就服务**：MockAchievementService

## 8. 验收标准

### 8.1 功能验收
- [ ] 用户可以完成注册和登录
- [ ] 用户可以上传论文或粘贴文本
- [ ] 系统支持三种检测级别
- [ ] 检测结果显示热力图
- [ ] 用户可以查看历史检测记录
- [ ] 进度追踪页面显示统计数据
- [ ] 社区帖子可以发表、评论、点赞
- [ ] 成就系统可以解锁和展示徽章

### 8.2 交互验收
- [ ] 页面加载流畅，无明显卡顿
- [ ] 检测进度实时更新
- [ ] 热力图悬停显示详细信息
- [ ] 图表交互响应及时
- [ ] 表单验证提示清晰

### 8.3 视觉验收
- [ ] 颜色方案符合学术严谨风格
- [ ] 排版清晰，层次分明
- [ ] 动画流畅自然
- [ ] 响应式布局适配良好
- [ ] 字体选择体现学术性
