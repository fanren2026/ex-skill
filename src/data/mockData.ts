import { SkillCategory, Achievement, CommunityPost } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'career',
    name: '职场核心技能',
    description: '提升职场竞争力的核心能力',
    icon: 'Briefcase',
    color: '#3B82F6',
    courses: [
      {
        id: 'career-basic',
        categoryId: 'career',
        name: '职场沟通基础',
        level: 'basic',
        description: '掌握职场沟通的基本原则和技巧',
        estimatedTime: 30,
        difficulty: 'easy',
        modules: [
          {
            id: 'c-b-1',
            courseId: 'career-basic',
            type: 'knowledge',
            title: '职场沟通基本原则',
            content: '职场沟通需要遵循清晰、简洁、礼貌三大原则。清晰表达自己的观点，用简洁的语言传递信息，保持礼貌的态度。',
            order: 1
          },
          {
            id: 'c-b-2',
            courseId: 'career-basic',
            type: 'case',
            title: '会议沟通案例',
            content: '某项目会议中，项目经理通过结构化表达，将复杂需求清晰传达给团队，提高了会议效率。',
            order: 2
          },
          {
            id: 'c-b-3',
            courseId: 'career-basic',
            type: 'error',
            title: '常见沟通误区',
            content: '常见误区：过于冗长、缺乏重点、语气生硬。这些都会影响沟通效果，需要特别注意。',
            order: 3
          },
          {
            id: 'c-b-4',
            courseId: 'career-basic',
            type: 'practice',
            title: '沟通练习',
            content: '请完成以下练习题，检验你的沟通知识掌握程度。',
            order: 4,
            questions: [
              {
                id: 'q1',
                question: '职场沟通的三大原则是什么？',
                options: ['清晰、简洁、礼貌', '快速、准确、完整', '详细、全面、深入', '直接、坦率、真诚'],
                correctAnswer: 0,
                explanation: '职场沟通需要遵循清晰、简洁、礼貌三大原则'
              },
              {
                id: 'q2',
                question: '以下哪种不是常见的沟通误区？',
                options: ['过于冗长', '缺乏重点', '语气生硬', '表达清晰'],
                correctAnswer: 3,
                explanation: '表达清晰是沟通的优点，不是误区'
              }
            ]
          }
        ]
      },
      {
        id: 'career-advanced',
        categoryId: 'career',
        name: '职场影响力提升',
        level: 'advanced',
        description: '学会影响他人，提升职场影响力',
        estimatedTime: 45,
        difficulty: 'medium',
        modules: [
          {
            id: 'c-a-1',
            courseId: 'career-advanced',
            type: 'knowledge',
            title: '影响力的来源',
            content: '影响力来源于专业能力、人格魅力、沟通技巧和积极心态。',
            order: 1
          },
          {
            id: 'c-a-2',
            courseId: 'career-advanced',
            type: 'case',
            title: '说服领导案例',
            content: '通过数据和案例，成功说服领导采纳新方案，展示了专业影响力。',
            order: 2
          },
          {
            id: 'c-a-3',
            courseId: 'career-advanced',
            type: 'error',
            title: '影响力误区',
            content: '试图通过职位权力施压往往效果不佳，真正的影响力来自尊重和信任。',
            order: 3
          },
          {
            id: 'c-a-4',
            courseId: 'career-advanced',
            type: 'practice',
            title: '影响力练习',
            content: '模拟场景练习，提升你的影响力技巧。',
            order: 4,
            questions: [
              {
                id: 'q3',
                question: '影响力的主要来源不包括？',
                options: ['专业能力', '人格魅力', '职位权力', '沟通技巧'],
                correctAnswer: 2,
                explanation: '影响力来源于专业能力、人格魅力、沟通技巧和积极心态'
              }
            ]
          }
        ]
      },
      {
        id: 'career-expert',
        categoryId: 'career',
        name: '领导力精要',
        level: 'expert',
        description: '成为卓越领导者的核心能力',
        estimatedTime: 60,
        difficulty: 'hard',
        modules: [
          {
            id: 'c-e-1',
            courseId: 'career-expert',
            type: 'knowledge',
            title: '领导力本质',
            content: '领导力是通过愿景激励团队，通过信任建立凝聚力，通过决策推动前进。',
            order: 1
          },
          {
            id: 'c-e-2',
            courseId: 'career-expert',
            type: 'case',
            title: '变革领导案例',
            content: '成功领导团队完成数字化转型，展现了卓越的变革领导力。',
            order: 2
          },
          {
            id: 'c-e-3',
            courseId: 'career-expert',
            type: 'error',
            title: '领导误区',
            content: '过度控制会扼杀团队创造力，真正的领导者懂得授权和信任。',
            order: 3
          },
          {
            id: 'c-e-4',
            courseId: 'career-expert',
            type: 'practice',
            title: '领导力评估',
            content: '完成领导力自我评估，发现提升空间。',
            order: 4,
            questions: [
              {
                id: 'q4',
                question: '领导力的本质是什么？',
                options: ['命令和控制', '激励和授权', '监督和检查', '指导和培训'],
                correctAnswer: 1,
                explanation: '领导力是通过愿景激励团队，通过信任建立凝聚力'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'general',
    name: '通用能力',
    description: '适用于各领域的基础能力',
    icon: 'Lightbulb',
    color: '#10B981',
    courses: [
      {
        id: 'general-basic',
        categoryId: 'general',
        name: '时间管理入门',
        level: 'basic',
        description: '学会有效管理时间，提高工作效率',
        estimatedTime: 25,
        difficulty: 'easy',
        modules: [
          {
            id: 'g-b-1',
            courseId: 'general-basic',
            type: 'knowledge',
            title: '时间管理四象限',
            content: '重要紧急、重要不紧急、紧急不重要、不紧急不重要。优先处理重要不紧急事项。',
            order: 1
          },
          {
            id: 'g-b-2',
            courseId: 'general-basic',
            type: 'case',
            title: '高效工作日志',
            content: '通过每日计划和复盘，成功提升工作效率30%。',
            order: 2
          },
          {
            id: 'g-b-3',
            courseId: 'general-basic',
            type: 'error',
            title: '时间管理误区',
            content: '常见误区：拖延、完美主义、不会拒绝。这些都会严重影响时间利用效率。',
            order: 3
          },
          {
            id: 'g-b-4',
            courseId: 'general-basic',
            type: 'practice',
            title: '时间管理练习',
            content: '制定你的每日计划，应用时间管理技巧。',
            order: 4,
            questions: [
              {
                id: 'q5',
                question: '时间管理四象限中，应该优先处理哪类事项？',
                options: ['重要紧急', '重要不紧急', '紧急不重要', '不紧急不重要'],
                correctAnswer: 1,
                explanation: '应该优先处理重要不紧急事项，避免它们变成重要紧急事项'
              }
            ]
          }
        ]
      },
      {
        id: 'general-advanced',
        categoryId: 'general',
        name: '批判性思维',
        level: 'advanced',
        description: '培养独立思考和分析能力',
        estimatedTime: 40,
        difficulty: 'medium',
        modules: [
          {
            id: 'g-a-1',
            courseId: 'general-advanced',
            type: 'knowledge',
            title: '批判性思维框架',
            content: '质疑假设、分析证据、评估逻辑、考虑替代方案。',
            order: 1
          },
          {
            id: 'g-a-2',
            courseId: 'general-advanced',
            type: 'case',
            title: '决策分析案例',
            content: '通过批判性分析，发现项目方案中的潜在风险，避免了重大损失。',
            order: 2
          },
          {
            id: 'g-a-3',
            courseId: 'general-advanced',
            type: 'error',
            title: '思维误区',
            content: '常见误区：确认偏差、过度自信、群体思维。这些会影响判断的准确性。',
            order: 3
          },
          {
            id: 'g-a-4',
            courseId: 'general-advanced',
            type: 'practice',
            title: '思维训练',
            content: '分析案例，应用批判性思维技巧。',
            order: 4,
            questions: [
              {
                id: 'q6',
                question: '以下哪个不是批判性思维的要素？',
                options: ['质疑假设', '分析证据', '盲目接受', '评估逻辑'],
                correctAnswer: 2,
                explanation: '批判性思维要求我们质疑而不是盲目接受'
              }
            ]
          }
        ]
      },
      {
        id: 'general-expert',
        categoryId: 'general',
        name: '系统思维',
        level: 'expert',
        description: '从整体视角理解复杂问题',
        estimatedTime: 55,
        difficulty: 'hard',
        modules: [
          {
            id: 'g-e-1',
            courseId: 'general-expert',
            type: 'knowledge',
            title: '系统思维原理',
            content: '理解系统的构成要素、相互关系和涌现行为，找到杠杆点。',
            order: 1
          },
          {
            id: 'g-e-2',
            courseId: 'general-expert',
            type: 'case',
            title: '系统优化案例',
            content: '通过系统分析，找到瓶颈环节，实现整体效率提升。',
            order: 2
          },
          {
            id: 'g-e-3',
            courseId: 'general-expert',
            type: 'error',
            title: '系统误区',
            content: '只关注局部优化可能导致整体恶化，需要考虑系统整体利益。',
            order: 3
          },
          {
            id: 'g-e-4',
            courseId: 'general-expert',
            type: 'practice',
            title: '系统分析',
            content: '分析复杂系统问题，应用系统思维方法。',
            order: 4,
            questions: [
              {
                id: 'q7',
                question: '系统思维强调什么？',
                options: ['局部最优', '整体视角', '单一因素', '线性思维'],
                correctAnswer: 1,
                explanation: '系统思维强调从整体视角理解复杂问题'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'technical',
    name: '专业技术',
    description: '各专业领域的核心技术能力',
    icon: 'Code',
    color: '#F59E0B',
    courses: [
      {
        id: 'tech-basic',
        categoryId: 'technical',
        name: '编程入门',
        level: 'basic',
        description: '掌握编程基础概念和入门技能',
        estimatedTime: 50,
        difficulty: 'easy',
        modules: [
          {
            id: 't-b-1',
            courseId: 'tech-basic',
            type: 'knowledge',
            title: '编程基础概念',
            content: '变量、数据类型、控制流程、函数是编程的基础概念。',
            order: 1
          },
          {
            id: 't-b-2',
            courseId: 'tech-basic',
            type: 'case',
            title: '简单程序案例',
            content: '通过编写一个简单的计算器程序，理解编程的基本流程。',
            order: 2
          },
          {
            id: 't-b-3',
            courseId: 'tech-basic',
            type: 'error',
            title: '常见编程错误',
            content: '语法错误、逻辑错误、运行时错误是编程中常见的三类错误。',
            order: 3
          },
          {
            id: 't-b-4',
            courseId: 'tech-basic',
            type: 'practice',
            title: '编程练习',
            content: '编写简单程序，巩固编程基础知识。',
            order: 4,
            questions: [
              {
                id: 'q8',
                question: '以下哪个不是编程的基础概念？',
                options: ['变量', '数据类型', '设计模式', '控制流程'],
                correctAnswer: 2,
                explanation: '设计模式是进阶概念，不是编程基础'
              }
            ]
          }
        ]
      },
      {
        id: 'tech-advanced',
        categoryId: 'technical',
        name: '数据结构与算法',
        level: 'advanced',
        description: '掌握核心数据结构和算法',
        estimatedTime: 70,
        difficulty: 'medium',
        modules: [
          {
            id: 't-a-1',
            courseId: 'tech-advanced',
            type: 'knowledge',
            title: '常用数据结构',
            content: '数组、链表、栈、队列、树、哈希表是常用的数据结构。',
            order: 1
          },
          {
            id: 't-a-2',
            courseId: 'tech-advanced',
            type: 'case',
            title: '算法优化案例',
            content: '通过优化算法，将查询时间从O(n)降低到O(log n)。',
            order: 2
          },
          {
            id: 't-a-3',
            courseId: 'tech-advanced',
            type: 'error',
            title: '算法误区',
            content: '过度优化、忽视边界条件、时间复杂度估算错误。',
            order: 3
          },
          {
            id: 't-a-4',
            courseId: 'tech-advanced',
            type: 'practice',
            title: '算法练习',
            content: '解决经典算法问题，提升算法能力。',
            order: 4,
            questions: [
              {
                id: 'q9',
                question: '以下哪个不是常用数据结构？',
                options: ['数组', '链表', '虚拟机', '哈希表'],
                correctAnswer: 2,
                explanation: '虚拟机是运行环境，不是数据结构'
              }
            ]
          }
        ]
      },
      {
        id: 'tech-expert',
        categoryId: 'technical',
        name: '系统架构设计',
        level: 'expert',
        description: '学会设计高可用、高性能系统',
        estimatedTime: 90,
        difficulty: 'hard',
        modules: [
          {
            id: 't-e-1',
            courseId: 'tech-expert',
            type: 'knowledge',
            title: '架构设计原则',
            content: '高内聚低耦合、单一职责、开闭原则、依赖倒置。',
            order: 1
          },
          {
            id: 't-e-2',
            courseId: 'tech-expert',
            type: 'case',
            title: '高可用架构案例',
            content: '通过分布式架构设计，实现系统的高可用性和弹性扩展。',
            order: 2
          },
          {
            id: 't-e-3',
            courseId: 'tech-expert',
            type: 'error',
            title: '架构误区',
            content: '过度设计、忽视可维护性、缺乏容错设计。',
            order: 3
          },
          {
            id: 't-e-4',
            courseId: 'tech-expert',
            type: 'practice',
            title: '架构设计',
            content: '设计一个高可用系统架构方案。',
            order: 4,
            questions: [
              {
                id: 'q10',
                question: '以下哪个不是架构设计原则？',
                options: ['高内聚低耦合', '单一职责', '过度设计', '开闭原则'],
                correctAnswer: 2,
                explanation: '过度设计是误区，不是原则'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    name: '初露锋芒',
    description: '完成第一个课程学习',
    icon: 'Star',
    requirement: '完成任意一个课程',
    unlocked: false
  },
  {
    id: 'knowledge-seeker',
    name: '知识探索者',
    description: '完成3个课程学习',
    icon: 'Compass',
    requirement: '完成3个课程',
    unlocked: false
  },
  {
    id: 'distillation-master',
    name: '蒸馏大师',
    description: '完成所有课程学习',
    icon: 'Crown',
    requirement: '完成所有课程',
    unlocked: false
  },
  {
    id: 'quick-learner',
    name: '快速学习者',
    description: '一周内完成2个课程',
    icon: 'Zap',
    requirement: '一周内完成2个课程',
    unlocked: false
  },
  {
    id: 'persistence',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: 'Flame',
    requirement: '连续学习7天',
    unlocked: false
  },
  {
    id: 'perfect-score',
    name: '完美答卷',
    description: '在练习中获得满分',
    icon: 'Award',
    requirement: '练习获得满分',
    unlocked: false
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: '职场达人小王',
    avatar: 'User',
    title: '分享我的职场沟通心得',
    content: '通过学习平台的职场沟通课程，我学会了如何更有效地表达自己的观点。最大的收获是学会了结构化表达，现在开会效率明显提升了。',
    category: 'career',
    createdAt: new Date('2024-01-15'),
    likes: 23,
    liked: false
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: '技术爱好者小李',
    avatar: 'User',
    title: '数据结构学习心得',
    content: '数据结构真的很重要！之前觉得算法很难，但通过平台的课程，一步步跟着练习，现在已经能独立解决中等难度的算法题了。',
    category: 'technical',
    createdAt: new Date('2024-01-14'),
    likes: 45,
    liked: true
  },
  {
    id: 'p3',
    userId: 'u3',
    userName: '时间管理新手',
    avatar: 'User',
    title: '时间管理改变了我的生活',
    content: '以前总是忙忙碌碌却没什么成果，学习了时间管理课程后，我学会了优先级管理，现在每天都能高效完成任务，还有时间做自己喜欢的事情！',
    category: 'general',
    createdAt: new Date('2024-01-13'),
    likes: 67,
    liked: false
  },
  {
    id: 'p4',
    userId: 'u4',
    userName: '职场新人小张',
    avatar: 'User',
    title: '给新人的建议',
    content: '刚入职的小伙伴一定要学习职场沟通课程！这对融入团队、获得领导认可非常有帮助。我就是受益者之一。',
    category: 'career',
    createdAt: new Date('2024-01-12'),
    likes: 34,
    liked: false
  },
  {
    id: 'p5',
    userId: 'u5',
    userName: '系统思维学习者',
    avatar: 'User',
    title: '系统思维让我看问题更透彻',
    content: '系统思维课程真的很棒！让我学会了从整体看问题，而不是只关注局部。推荐给所有想要提升思维能力的朋友。',
    category: 'general',
    createdAt: new Date('2024-01-11'),
    likes: 52,
    liked: false
  }
];

export const getCategoryById = (id: string): SkillCategory | undefined => {
  return skillCategories.find(cat => cat.id === id);
};

export const getCourseById = (courseId: string) => {
  for (const category of skillCategories) {
    const course = category.courses.find(c => c.id === courseId);
    if (course) return course;
  }
  return undefined;
};

export const getModuleById = (moduleId: string) => {
  for (const category of skillCategories) {
    for (const course of category.courses) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module) return module;
    }
  }
  return undefined;
};