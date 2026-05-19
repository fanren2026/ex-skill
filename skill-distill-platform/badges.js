/**
 * Badges Page JavaScript
 */

const STORAGE_KEY = 'skilldistill_user';

// 徽章数据库
const badgesDatabase = [
    {
        id: 'first_step',
        title: '第一步',
        description: '完成你的第一个学习单元，迈出技能提升的第一步',
        category: 'learning',
        rarity: 'bronze',
        reward: 10,
        requirement: '完成1个学习单元'
    },
    {
        id: 'active_learner',
        title: '活跃学习者',
        description: '累计完成10个学习单元，展现出色的学习能力',
        category: 'learning',
        rarity: 'silver',
        reward: 50,
        requirement: '完成10个学习单元'
    },
    {
        id: 'knowledge_seeker',
        title: '知识追求者',
        description: '累计完成50个学习单元，成为真正的知识追求者',
        category: 'learning',
        rarity: 'gold',
        reward: 200,
        requirement: '完成50个学习单元'
    },
    {
        id: 'week_streak',
        title: '连续7天',
        description: '连续7天不间断学习，展现出色的学习毅力',
        category: 'streak',
        rarity: 'silver',
        reward: 70,
        requirement: '连续学习7天'
    },
    {
        id: 'month_streak',
        title: '连续30天',
        description: '连续30天不间断学习，成为学习达人',
        category: 'streak',
        rarity: 'gold',
        reward: 300,
        requirement: '连续学习30天'
    },
    {
        id: 'century_learner',
        title: '百日学者',
        description: '连续100天不间断学习，这是真正的坚持',
        category: 'streak',
        rarity: 'crystal',
        reward: 1000,
        requirement: '连续学习100天'
    },
    {
        id: 'first_post',
        title: '社区新人',
        description: '在社区发布你的第一篇帖子，开始你的社区之旅',
        category: 'social',
        rarity: 'bronze',
        reward: 20,
        requirement: '发布1篇帖子'
    },
    {
        id: 'helpful_member',
        title: '乐于助人',
        description: '帮助其他学习者回答10个问题，展现社区精神',
        category: 'social',
        rarity: 'silver',
        reward: 80,
        requirement: '回复10个问题'
    },
    {
        id: 'community_star',
        title: '社区之星',
        description: '你的帖子获得100次点赞，成为社区明星',
        category: 'social',
        rarity: 'gold',
        reward: 250,
        requirement: '获得100次点赞'
    },
    {
        id: 'speed_demon',
        title: '速战速决',
        description: '在1天内完成5个学习单元，学习效率惊人',
        category: 'special',
        rarity: 'silver',
        reward: 100,
        requirement: '1天完成5个学习'
    },
    {
        id: 'perfectionist',
        title: '完美主义',
        description: '连续10次练习达到100%正确率，追求卓越',
        category: 'special',
        rarity: 'gold',
        reward: 200,
        requirement: '10次100%正确'
    },
    {
        id: 'all_rounder',
        title: '全能选手',
        description: '在所有技能领域都有所涉猎，成为多面手',
        category: 'special',
        rarity: 'crystal',
        reward: 500,
        requirement: '学习5个不同领域'
    }
];

// 任务数据库
const tasksDatabase = [
    {
        id: 'task_1',
        title: '完成学习引导',
        description: '完成平台的入门学习引导，熟悉各个功能模块',
        reward: 30,
        progress: 0,
        target: 1,
        link: 'index.html'
    },
    {
        id: 'task_2',
        title: '学习第一个技能',
        description: '完成任意一个技能的基础入门课程',
        reward: 50,
        progress: 0,
        target: 1,
        link: 'index.html#levels'
    },
    {
        id: 'task_3',
        title: '连续学习3天',
        description: '保持连续3天的学习记录，培养良好习惯',
        reward: 80,
        progress: 0,
        target: 3,
        type: 'streak'
    },
    {
        id: 'task_4',
        title: '参与社区讨论',
        description: '在社区发布帖子或回复其他学习者的问题',
        reward: 40,
        progress: 0,
        target: 1,
        link: 'community.html'
    },
    {
        id: 'task_5',
        title: '解锁3个徽章',
        description: '通过学习和互动，解锁至少3个成就徽章',
        reward: 100,
        progress: 0,
        target: 3,
        link: 'badges.html'
    }
];

// 初始化
function initialize() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initializeUserData();
    
    if (!userData.badges) {
        userData.badges = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
    
    updateSummary();
    renderBadges('all');
    renderTasks();
    setupTabs();
    setupModal();
}

// 初始化用户数据
function initializeUserData() {
    return {
        profile: {
            name: '学习者',
            level: 1,
            totalPoints: 0,
            joinedDate: Date.now(),
            lastActive: Date.now()
        },
        skills: {},
        badges: [],
        community: {
            posts: [],
            replies: [],
            likes: []
        },
        progress: {
            totalProgress: 0,
            learningStreak: 0,
            lastLearnDate: null
        },
        modules: {
            knowledge: { completed: 0, total: 20 },
            practice: { completed: 0, total: 15 },
            review: { completed: 0, total: 10 },
            application: { completed: 0, total: 12 }
        }
    };
}

// 更新统计摘要
function updateSummary() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    const earnedBadges = userData?.badges?.length || 0;
    const totalBadges = badgesDatabase.length;
    const totalPoints = userData?.totalPoints || 0;
    const completionRate = Math.round((earnedBadges / totalBadges) * 100);
    const remaining = totalBadges - earnedBadges;
    
    document.getElementById('totalBadges').textContent = earnedBadges;
    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    document.getElementById('remainingBadges').textContent = remaining;
}

// 渲染徽章
function renderBadges(category) {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const earnedBadges = userData?.badges || [];
    
    const badgesGrid = document.getElementById('badgesGrid');
    
    let filteredBadges = badgesDatabase;
    if (category !== 'all') {
        filteredBadges = badgesDatabase.filter(badge => badge.category === category);
    }
    
    badgesGrid.innerHTML = filteredBadges.map(badge => {
        const isEarned = earnedBadges.includes(badge.id);
        
        return `
            <div class="badge-card ${badge.rarity} ${!isEarned ? 'locked' : ''}" 
                 data-badge-id="${badge.id}"
                 onclick="showBadgeDetail('${badge.id}')">
                <div class="badge-icon">
                    ${getBadgeIcon(badge.rarity)}
                </div>
                <h3 class="badge-title">${badge.title}</h3>
                <p class="badge-description">${badge.description}</p>
                <div class="badge-status ${isEarned ? 'earned' : 'locked'}">
                    ${isEarned ? '✓ 已获得' : '🔒 待解锁'}
                </div>
                ${isEarned ? `<div class="badge-reward">+${badge.reward} 积分</div>` : ''}
            </div>
        `;
    }).join('');
}

// 获取徽章图标
function getBadgeIcon(rarity) {
    const icons = {
        gold: `<svg viewBox="0 0 48 48" fill="none">
            <path d="M24 4L29 16L42 18L33 28L35 42L24 36L13 42L15 28L6 18L19 16L24 4Z" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
        </svg>`,
        silver: `<svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="16" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
            <path d="M24 12V36M12 24H36" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        bronze: `<svg viewBox="0 0 48 48" fill="none">
            <rect x="12" y="12" width="24" height="24" rx="4" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
            <path d="M20 24L24 28L32 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        crystal: `<svg viewBox="0 0 48 48" fill="none">
            <path d="M24 4L40 14V34L24 44L8 34V14L24 4Z" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
            <circle cx="24" cy="24" r="6" fill="white"/>
        </svg>`
    };
    return icons[rarity] || icons.crystal;
}

// 渲染任务
function renderTasks() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const earnedBadges = userData?.badges || [];
    
    const tasksList = document.getElementById('tasksList');
    
    tasksList.innerHTML = tasksDatabase.map(task => {
        let progress = 0;
        
        if (task.type === 'streak') {
            progress = userData?.progress?.learningStreak || 0;
        } else if (task.link === 'community.html') {
            progress = (userData?.community?.posts?.length || 0) + (userData?.community?.replies?.length || 0);
        } else {
            progress = earnedBadges.length;
        }
        
        const isCompleted = progress >= task.target;
        
        return `
            <div class="task-card ${isCompleted ? 'completed' : ''}">
                <div class="task-icon">
                    ${isCompleted ? 
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/></svg>'
                    }
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                </div>
                <div class="task-progress">
                    <div class="task-reward">+${task.reward}</div>
                    ${task.link ? 
                        `<a href="${task.link}" class="task-action ${isCompleted ? 'completed' : 'primary'}">${isCompleted ? '已完成' : '去完成'}</a>` :
                        `<span class="task-action ${isCompleted ? 'completed' : 'primary'}">${isCompleted ? '已完成' : `${progress}/${task.target}`}</span>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// 设置标签切换
function setupTabs() {
    const tabs = document.querySelectorAll('.badge-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            renderBadges(category);
        });
    });
}

// 设置模态框
function setupModal() {
    const modal = document.getElementById('badgeModal');
    const closeBtn = document.getElementById('closeBadgeModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBadgeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBadgeModal();
            }
        });
    }
}

// 显示徽章详情
function showBadgeDetail(badgeId) {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const earnedBadges = userData?.badges || [];
    const badge = badgesDatabase.find(b => b.id === badgeId);
    
    if (!badge) return;
    
    const isEarned = earnedBadges.includes(badgeId);
    
    const modal = document.getElementById('badgeModal');
    const title = document.getElementById('badgeModalTitle');
    const content = document.getElementById('badgeModalContent');
    
    title.textContent = badge.title;
    
    content.innerHTML = `
        <div class="badge-detail">
            <div class="badge-detail-icon ${badge.rarity}">
                ${getBadgeIcon(badge.rarity)}
            </div>
            <h3>${badge.title}</h3>
            <p>${badge.description}</p>
            <div class="badge-detail-stats">
                <div class="badge-stat">
                    <div class="badge-stat-value">${isEarned ? '已获得' : '未获得'}</div>
                    <div class="badge-stat-label">状态</div>
                </div>
                <div class="badge-stat">
                    <div class="badge-stat-value">${badge.reward}</div>
                    <div class="badge-stat-label">奖励积分</div>
                </div>
                <div class="badge-stat">
                    <div class="badge-stat-value">${badge.requirement}</div>
                    <div class="badge-stat-label">解锁条件</div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭徽章详情
function closeBadgeModal() {
    const modal = document.getElementById('badgeModal');
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// 设置导航栏
function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initialize();
    setupNavigation();
});
