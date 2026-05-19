/**
 * Progress Page JavaScript
 */

const STORAGE_KEY = 'skilldistill_user';

// 初始化
function initialize() {
    loadProgressData();
    setupNavigation();
}

// 加载进度数据
function loadProgressData() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    if (!userData) {
        // 如果没有数据，创建默认数据
        userData = createDefaultUserData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
    
    updateOverviewStats(userData);
    updateModulesProgress(userData);
    updateWeakAreas(userData);
    updateTimeline(userData);
}

// 创建默认用户数据
function createDefaultUserData() {
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
            learningStreak: 3,
            lastLearnDate: new Date().toDateString(),
            weakAreas: [],
            strengths: []
        },
        modules: {
            knowledge: { completed: 5, total: 20 },
            practice: { completed: 3, total: 15 },
            review: { completed: 2, total: 10 },
            application: { completed: 4, total: 12 }
        }
    };
}

// 更新概览统计
function updateOverviewStats(userData) {
    // 计算总体进度
    const modules = userData.modules;
    let totalCompleted = 0;
    let totalItems = 0;
    
    Object.values(modules).forEach(module => {
        totalCompleted += module.completed;
        totalItems += module.total;
    });
    
    const overallPercentage = Math.round((totalCompleted / totalItems) * 100);
    
    // 更新总体进度环
    const overallRing = document.getElementById('overallProgressRing');
    const percentageText = document.getElementById('overallPercentage');
    
    if (overallRing) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (overallPercentage / 100) * circumference;
        overallRing.style.strokeDashoffset = offset;
    }
    
    if (percentageText) {
        percentageText.textContent = `${overallPercentage}%`;
    }
    
    // 更新连续学习天数
    const streakDays = document.getElementById('streakDays');
    const streakMessage = document.getElementById('streakMessage');
    
    if (streakDays) {
        streakDays.textContent = userData.progress.learningStreak;
    }
    
    if (streakMessage) {
        const streak = userData.progress.learningStreak;
        let message = '加油，坚持学习！';
        
        if (streak >= 30) {
            message = '太厉害了，30天坚持！';
        } else if (streak >= 14) {
            message = '继续保持，非常棒！';
        } else if (streak >= 7) {
            message = '一周达成，继续加油！';
        } else if (streak >= 3) {
            message = '已经形成习惯，很好！';
        }
        
        streakMessage.textContent = message;
    }
    
    // 更新今日学习
    const todayLessons = document.getElementById('todayLessons');
    const todayTarget = document.getElementById('todayTarget');
    
    if (todayLessons) {
        todayLessons.textContent = totalCompleted;
    }
    
    if (todayTarget) {
        todayTarget.textContent = 5;
    }
    
    // 更新总积分
    const totalPoints = document.getElementById('totalPoints');
    const pointsRank = document.getElementById('pointsRank');
    
    if (totalPoints) {
        totalPoints.textContent = userData.totalPoints || 0;
    }
    
    if (pointsRank) {
        const points = userData.totalPoints || 0;
        let rank = '前10%';
        
        if (points >= 1000) {
            rank = '前1%';
        } else if (points >= 500) {
            rank = '前5%';
        } else if (points >= 200) {
            rank = '前10%';
        } else if (points >= 50) {
            rank = '前20%';
        } else {
            rank = '前50%';
        }
        
        pointsRank.textContent = rank;
    }
}

// 更新模块进度
function updateModulesProgress(userData) {
    const modules = ['knowledge', 'practice', 'review', 'application'];
    
    modules.forEach(moduleName => {
        const moduleData = userData.modules[moduleName];
        const progress = (moduleData.completed / moduleData.total) * 100;
        
        const progressBar = document.getElementById(`${moduleName}Progress`);
        const completed = document.getElementById(`${moduleName}Completed`);
        const total = document.getElementById(`${moduleName}Total`);
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (completed) {
            completed.textContent = moduleData.completed;
        }
        
        if (total) {
            total.textContent = moduleData.total;
        }
    });
}

// 更新薄弱环节
function updateWeakAreas(userData) {
    const weakAreasList = document.getElementById('weakAreasList');
    const strengthsList = document.getElementById('strengthsList');
    
    const weakAreas = userData.progress.weakAreas || [];
    const strengths = userData.progress.strengths || [];
    
    // 模拟一些薄弱环节（基于模块进度）
    const modules = userData.modules;
    const simulatedWeakAreas = [];
    
    if (modules.practice.completed / modules.practice.total < 0.3) {
        simulatedWeakAreas.push({
            name: '实操能力',
            level: '需要加强',
            suggestion: '建议多完成案例练习'
        });
    }
    
    if (modules.review.completed / modules.review.total < 0.2) {
        simulatedWeakAreas.push({
            name: '错题复盘',
            level: '明显薄弱',
            suggestion: '加强薄弱环节的专项练习'
        });
    }
    
    // 模拟优势领域
    const simulatedStrengths = [];
    
    if (modules.knowledge.completed / modules.knowledge.total > 0.4) {
        simulatedStrengths.push('理论知识扎实');
    }
    
    if (modules.application.completed / modules.application.total > 0.4) {
        simulatedStrengths.push('应用能力强');
    }
    
    // 渲染薄弱环节
    if (weakAreasList) {
        if (simulatedWeakAreas.length > 0) {
            weakAreasList.innerHTML = simulatedWeakAreas.map(area => `
                <div class="weak-area-item">
                    <div>
                        <div class="weak-area-name">${area.name}</div>
                        <div class="weak-area-level">${area.level}</div>
                    </div>
                    <div class="weak-area-suggestion">
                        <span class="suggestion-tag">
                            💡 ${area.suggestion}
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // 渲染优势领域
    if (strengthsList && simulatedStrengths.length > 0) {
        strengthsList.innerHTML = `
            <h3>已掌握领域</h3>
            ${simulatedStrengths.map(strength => `
                <div class="weak-area-item" style="border-color: var(--success-green);">
                    <div>
                        <div class="weak-area-name">${strength}</div>
                        <div class="weak-area-level" style="color: var(--success-green);">掌握良好</div>
                    </div>
                </div>
            `).join('')}
        `;
    }
}

// 更新学习时间线
function updateTimeline(userData) {
    const timeline = document.getElementById('learningTimeline');
    
    const today = new Date();
    const joinedDate = new Date(userData.profile.joinedDate);
    
    const timelineItems = [
        {
            date: '今天',
            title: '继续学习',
            description: '完成更多学习内容，持续提升'
        },
        {
            date: joinedDate.toLocaleDateString('zh-CN'),
            title: '开始学习之旅',
            description: '欢迎来到 SkillDistill，开始你的技能提升之旅'
        }
    ];
    
    if (timeline) {
        timeline.innerHTML = timelineItems.map((item, index) => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-description">${item.description}</div>
                </div>
            </div>
        `).join('');
    }
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
});
