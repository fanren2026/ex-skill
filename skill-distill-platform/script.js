/**
 * SkillDistill - 智能蒸馏学习平台
 * 主交互脚本
 */

// ========================================
// 数据存储和初始化
// ========================================

const STORAGE_KEY = 'skilldistill_user';

// 初始化用户数据
function initializeUserData() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
        return JSON.parse(existing);
    }
    
    const newUser = {
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
        preferences: {
            targetSkills: [],
            availableTime: 'medium',
            learningGoal: '',
            currentLevel: 'intermediate'
        },
        progress: {
            totalProgress: 0,
            learningStreak: 0,
            lastLearnDate: null,
            weakAreas: [],
            strengths: []
        },
        modules: {
            knowledge: { completed: 0, total: 20 },
            practice: { completed: 0, total: 15 },
            review: { completed: 0, total: 10 },
            application: { completed: 0, total: 12 }
        }
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
}

// 保存用户数据
function saveUserData(data) {
    data.profile.lastActive = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 获取用户数据
function getUserData() {
    return initializeUserData();
}

// ========================================
// 导航栏交互
// ========================================

function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // 平滑滚动到锚点
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 更新活动链接
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // 关闭移动端菜单
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // 滚动时更新导航栏
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // 更新当前可见区域的导航链接
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// 英雄区域动画
// ========================================

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ========================================
// 进度追踪
// ========================================

function updateProgressDisplay() {
    const userData = getUserData();
    const progress = userData.progress;
    
    // 更新导航栏进度
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    if (progressCircle && progressText) {
        const circumference = 2 * Math.PI * 15.5;
        const offset = circumference - (progress.totalProgress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = `${progress.totalProgress}%`;
    }
    
    // 更新首页统计
    const userProgress = document.getElementById('userProgress');
    if (userProgress) {
        userProgress.textContent = progress.totalProgress;
    }
    
    const learningStreak = document.getElementById('learningStreak');
    if (learningStreak) {
        learningStreak.textContent = progress.learningStreak;
    }
    
    const earnedBadges = document.getElementById('earnedBadges');
    if (earnedBadges) {
        earnedBadges.textContent = userData.badges.length;
    }
    
    const communityPosts = document.getElementById('communityPosts');
    if (communityPosts) {
        const totalPosts = userData.community.posts.length + 
                          userData.community.replies.length;
        communityPosts.textContent = totalPosts;
    }
    
    // 更新模块进度
    updateModulesProgress();
}

function updateModulesProgress() {
    const userData = getUserData();
    const modules = ['knowledge', 'practice', 'review', 'application'];
    
    modules.forEach(moduleName => {
        const moduleData = userData.modules[moduleName];
        const moduleCard = document.querySelector(`[data-module="${moduleName}"]`);
        
        if (moduleCard && moduleData) {
            const progressFill = moduleCard.querySelector('.progress-fill');
            const progressLabel = moduleCard.querySelector('.progress-label');
            
            if (progressFill) {
                const percentage = (moduleData.completed / moduleData.total) * 100;
                progressFill.style.width = `${percentage}%`;
            }
            
            if (progressLabel) {
                progressLabel.textContent = `已完成 ${moduleData.completed} / ${moduleData.total} 个`;
            }
        }
    });
}

function calculateOverallProgress() {
    const userData = getUserData();
    let totalCompleted = 0;
    let totalItems = 0;
    
    Object.values(userData.modules).forEach(module => {
        totalCompleted += module.completed;
        totalItems += module.total;
    });
    
    const percentage = Math.round((totalCompleted / totalItems) * 100);
    userData.progress.totalProgress = percentage;
    saveUserData(userData);
    
    return percentage;
}

// ========================================
// 个性化推荐系统
// ========================================

function setupAssessment() {
    const startBtn = document.getElementById('startAssessmentBtn');
    const assessmentPrompt = document.getElementById('assessmentPrompt');
    const assessmentForm = document.getElementById('assessmentForm');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            assessmentPrompt.classList.add('hidden');
            assessmentForm.classList.remove('hidden');
            showFormStep(1);
        });
    }
    
    setupFormSteps();
}

function setupFormSteps() {
    // Step 1: 目标选择
    const goalOptions = document.querySelectorAll('input[name="goals"]');
    const nextStep1Btn = document.getElementById('nextStep1Btn');
    
    goalOptions.forEach(option => {
        option.addEventListener('change', () => {
            const selectedCount = document.querySelectorAll('input[name="goals"]:checked').length;
            nextStep1Btn.disabled = selectedCount === 0;
        });
    });
    
    nextStep1Btn.addEventListener('click', () => {
        showFormStep(2);
    });
    
    // Step 2: 基础水平
    const levelOptions = document.querySelectorAll('input[name="level"]');
    const nextStep2Btn = document.getElementById('nextStep2Btn');
    const prevStep2Btn = document.getElementById('prevStep2Btn');
    
    levelOptions.forEach(option => {
        option.addEventListener('change', () => {
            nextStep2Btn.disabled = false;
        });
    });
    
    nextStep2Btn.addEventListener('click', () => {
        showFormStep(3);
    });
    
    prevStep2Btn.addEventListener('click', () => {
        showFormStep(1);
    });
    
    // Step 3: 学习时间
    const timeOptions = document.querySelectorAll('input[name="time"]');
    const generatePathBtn = document.getElementById('generatePathBtn');
    const prevStep3Btn = document.getElementById('prevStep3Btn');
    
    timeOptions.forEach(option => {
        option.addEventListener('change', () => {
            generatePathBtn.disabled = false;
        });
    });
    
    generatePathBtn.addEventListener('click', generateLearningPath);
    
    prevStep3Btn.addEventListener('click', () => {
        showFormStep(2);
    });
    
    // 重置评估
    const resetBtn = document.getElementById('resetAssessmentBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAssessment);
    }
    
    // 开始学习
    const startLearningBtn = document.getElementById('startLearningBtn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', startLearning);
    }
}

function showFormStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => {
        s.classList.remove('active');
        if (parseInt(s.dataset.step) === step) {
            s.classList.add('active');
        }
    });
}

function generateLearningPath() {
    const userData = getUserData();
    
    // 收集用户选择
    const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
        .map(el => el.value);
    const selectedLevel = document.querySelector('input[name="level"]:checked')?.value;
    const selectedTime = document.querySelector('input[name="time"]:checked')?.value;
    
    // 保存用户偏好
    userData.preferences = {
        targetSkills: selectedGoals,
        availableTime: selectedTime,
        currentLevel: selectedLevel
    };
    
    // 生成推荐技能
    const recommendations = generateRecommendations(selectedGoals, selectedLevel);
    
    // 显示结果
    const assessmentForm = document.getElementById('assessmentForm');
    const recommendationResult = document.getElementById('recommendationResult');
    
    assessmentForm.classList.add('hidden');
    recommendationResult.classList.remove('hidden');
    
    // 渲染推荐技能
    const recommendedSkillsContainer = document.getElementById('recommendedSkills');
    recommendedSkillsContainer.innerHTML = recommendations.map(skill => `
        <div class="recommended-skill">
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
            <span class="skill-level">${getLevelText(skill.level)}</span>
        </div>
    `).join('');
    
    // 更新统计
    const totalDuration = document.getElementById('totalDuration');
    const skillCount = document.getElementById('skillCount');
    const dailyTime = document.getElementById('dailyTime');
    
    const totalDays = recommendations.reduce((sum, r) => sum + r.duration, 0);
    totalDuration.textContent = `${totalDays}天`;
    skillCount.textContent = recommendations.length;
    dailyTime.textContent = getTimeText(selectedTime);
    
    saveUserData(userData);
}

function generateRecommendations(goals, level) {
    const skillsDatabase = {
        '职场沟通': [
            { name: '高效汇报技巧', description: '3分钟电梯演讲', duration: 7, level: 'beginner' },
            { name: '跨部门协作', description: '打破信息孤岛', duration: 14, level: 'intermediate' },
            { name: '冲突管理', description: '化矛盾为合作', duration: 10, level: 'advanced' }
        ],
        '数据分析': [
            { name: 'Excel高级应用', description: '数据处理神器', duration: 14, level: 'beginner' },
            { name: 'SQL数据查询', description: '数据库入门', duration: 21, level: 'intermediate' },
            { name: 'Python数据分析', description: '自动化分析', duration: 30, level: 'advanced' }
        ],
        '技术开发': [
            { name: '编程基础入门', description: '零基础开始', duration: 14, level: 'beginner' },
            { name: '前端开发实战', description: 'HTML/CSS/JS', duration: 28, level: 'intermediate' },
            { name: '全栈架构设计', description: '系统设计思维', duration: 45, level: 'advanced' }
        ],
        '项目管理': [
            { name: '敏捷项目管理', description: 'Scrum框架', duration: 7, level: 'beginner' },
            { name: '需求管理', description: '从需求到交付', duration: 14, level: 'intermediate' },
            { name: '项目集管理', description: '多项目协调', duration: 21, level: 'advanced' }
        ],
        '产品运营': [
            { name: '用户增长策略', description: 'AARRR模型', duration: 10, level: 'beginner' },
            { name: '数据分析驱动', description: '数据运营方法', duration: 14, level: 'intermediate' },
            { name: '增长黑客', description: '低成本获客', duration: 21, level: 'advanced' }
        ],
        '领导力': [
            { name: '团队激励', description: '激发团队潜能', duration: 7, level: 'beginner' },
            { name: '绩效管理', description: '目标与反馈', duration: 14, level: 'intermediate' },
            { name: '战略领导力', description: '长远眼光', duration: 30, level: 'advanced' }
        ]
    };
    
    const levelPriority = {
        'beginner': 0,
        'intermediate': 1,
        'advanced': 2
    };
    
    let recommendations = [];
    
    goals.forEach(goal => {
        if (skillsDatabase[goal]) {
            const skills = skillsDatabase[goal];
            skills.forEach(skill => {
                if (levelPriority[skill.level] >= levelPriority[level]) {
                    recommendations.push(skill);
                }
            });
        }
    });
    
    return recommendations.slice(0, 9);
}

function getLevelText(level) {
    const texts = {
        'beginner': '基础入门',
        'intermediate': '进阶提升',
        'advanced': '高阶精通'
    };
    return texts[level] || level;
}

function getTimeText(time) {
    const texts = {
        'low': '30分钟',
        'medium': '1小时',
        'high': '2小时+'
    };
    return texts[time] || time;
}

function resetAssessment() {
    const assessmentPrompt = document.getElementById('assessmentPrompt');
    const assessmentForm = document.getElementById('assessmentForm');
    const recommendationResult = document.getElementById('recommendationResult');
    
    assessmentPrompt.classList.remove('hidden');
    assessmentForm.classList.add('hidden');
    recommendationResult.classList.add('hidden');
    
    // 重置表单
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    showFormStep(1);
}

function startLearning() {
    // 更新学习连续天数
    const userData = getUserData();
    const today = new Date().toDateString();
    
    if (userData.progress.lastLearnDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userData.progress.lastLearnDate === yesterday.toDateString()) {
            userData.progress.learningStreak++;
        } else {
            userData.progress.learningStreak = 1;
        }
        
        userData.progress.lastLearnDate = today;
        saveUserData(userData);
    }
    
    // 滚动到层级选择
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// 模块学习功能
// ========================================

function startModule(moduleName) {
    const userData = getUserData();
    const moduleData = userData.modules[moduleName];
    
    if (moduleData.completed < moduleData.total) {
        // 模拟完成一个学习单元
        moduleData.completed++;
        userData.totalPoints += 10;
        saveUserData(userData);
        
        // 检查成就
        checkAchievements();
        
        // 更新显示
        updateProgressDisplay();
        calculateOverallProgress();
        
        // 显示提示
        showNotification(`恭喜完成一个学习单元！获得10积分。`);
        
        // 更新模块进度
        updateModulesProgress();
    } else {
        showNotification('该模块已全部完成！');
    }
}

function selectLevel(level) {
    const userData = getUserData();
    userData.preferences.currentLevel = level;
    saveUserData(userData);
    
    // 滚动到模块选择
    document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`已选择${getLevelText(level)}路径，开始学习吧！`);
}

// ========================================
// 成就系统
// ========================================

function checkAchievements() {
    const userData = getUserData();
    const newBadges = [];
    
    // 检查各种成就条件
    if (userData.totalPoints >= 10 && !userData.badges.includes('first_step')) {
        newBadges.push('first_step');
    }
    
    if (userData.progress.learningStreak >= 7 && !userData.badges.includes('week_streak')) {
        newBadges.push('week_streak');
    }
    
    if (userData.progress.learningStreak >= 30 && !userData.badges.includes('month_streak')) {
        newBadges.push('month_streak');
    }
    
    const totalCompleted = Object.values(userData.modules).reduce((sum, m) => sum + m.completed, 0);
    if (totalCompleted >= 10 && !userData.badges.includes('active_learner')) {
        newBadges.push('active_learner');
    }
    
    if (totalCompleted >= 50 && !userData.badges.includes('knowledge_seeker')) {
        newBadges.push('knowledge_seeker');
    }
    
    // 添加新成就
    newBadges.forEach(badge => {
        userData.badges.push(badge);
        showNotification(`🎉 解锁新成就：${getBadgeName(badge)}！`);
    });
    
    saveUserData(userData);
}

function getBadgeName(badge) {
    const names = {
        'first_step': '第一步',
        'week_streak': '连续7天',
        'month_streak': '连续30天',
        'active_learner': '活跃学习者',
        'knowledge_seeker': '知识追求者'
    };
    return names[badge] || badge;
}

// ========================================
// 通知系统
// ========================================

function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加通知动画样式
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .notification-content {
        background: var(--primary-light);
        border: 1px solid var(--accent-crystal);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        color: var(--text-primary);
        box-shadow: var(--shadow-lg);
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// 按钮事件绑定
// ========================================

function setupButtonEvents() {
    // 开始蒸馏按钮
    const startDistillBtn = document.getElementById('startDistillBtn');
    if (startDistillBtn) {
        startDistillBtn.addEventListener('click', () => {
            document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // 了解更多按钮
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // CTA开始按钮
    const ctaStartBtn = document.getElementById('ctaStartBtn');
    if (ctaStartBtn) {
        ctaStartBtn.addEventListener('click', () => {
            document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ========================================
// 模态框控制
// ========================================

function setupModal() {
    const modal = document.getElementById('learningModal');
    const closeBtn = document.getElementById('closeModal');
    const closeBtn2 = document.getElementById('modalCloseBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (closeBtn2) {
        closeBtn2.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function openModal(title, content) {
    const modal = document.getElementById('learningModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalTitle && modalContent) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modal.classList.remove('hidden');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('learningModal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ========================================
// 滚动动画
// ========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.level-card, .module-card, .stats-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 添加可见状态样式
const visibleStyles = document.createElement('style');
visibleStyles.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(visibleStyles);

// ========================================
// 初始化
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化用户数据
    initializeUserData();
    
    // 设置导航栏
    setupNavigation();
    
    // 初始化英雄区域统计动画
    animateStats();
    
    // 更新进度显示
    updateProgressDisplay();
    
    // 设置评估表单
    setupAssessment();
    
    // 设置按钮事件
    setupButtonEvents();
    
    // 设置模态框
    setupModal();
    
    // 设置滚动动画
    setupScrollAnimations();
    
    console.log('SkillDistill 平台已初始化');
});

// ========================================
// 全局函数
// ========================================

// 供HTML调用的全局函数
window.selectLevel = selectLevel;
window.startModule = startModule;
window.startLearning = startLearning;
window.resetAssessment = resetAssessment;
window.closeModal = closeModal;
