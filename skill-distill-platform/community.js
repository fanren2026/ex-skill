/**
 * Community Page JavaScript
 */

const STORAGE_KEY = 'skilldistill_user';

// 初始化社区数据
function initializeCommunity() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        community: {
            posts: [],
            replies: [],
            likes: []
        },
        totalPoints: 0
    };
    
    if (!userData.community) {
        userData.community = {
            posts: [],
            replies: [],
            likes: []
        };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
}

// 加载示例帖子数据
const samplePosts = [
    {
        id: 1,
        author: '数据分析师小王',
        avatar: '王',
        title: '数据分析技能学习心得：从入门到实战',
        excerpt: '分享一下我学习数据分析的经历，从最初的Excel基础到Python爬虫，再到商业智能报表...',
        category: '经验分享',
        tags: ['数据分析', '学习心得', 'Python'],
        likes: 128,
        replies: 45,
        time: '2小时前'
    },
    {
        id: 2,
        author: '项目经理小李',
        avatar: '李',
        title: '敏捷项目管理实战经验总结',
        excerpt: '在团队中推行敏捷已经一年了，总结一下我们遇到的问题和解决方案...',
        category: '讨论区',
        tags: ['项目管理', '敏捷', '团队协作'],
        likes: 256,
        replies: 89,
        time: '5小时前'
    },
    {
        id: 3,
        author: '职场新人小张',
        avatar: '张',
        title: '职场沟通有哪些坑？我踩过的那些雷',
        excerpt: '刚入职场的我发现职场沟通和学校完全不一样，分享一下我踩过的坑...',
        category: '经验分享',
        tags: ['职场沟通', '新人必看'],
        likes: 345,
        replies: 112,
        time: '1天前'
    },
    {
        id: 4,
        author: '技术专家老陈',
        avatar: '陈',
        title: '如何快速掌握一门新技术？',
        excerpt: '作为技术团队的负责人，我经常需要快速学习新技术，这里分享我的方法论...',
        category: '讨论区',
        tags: ['学习方法', '技术成长'],
        likes: 567,
        replies: 156,
        time: '1天前'
    },
    {
        id: 5,
        author: '产品经理小刘',
        avatar: '刘',
        title: '产品数据分析从0到1：我的学习路径',
        excerpt: '从运营转产品，最难的是数据分析部分。这是我总结的学习路径...',
        category: '经验分享',
        tags: ['产品经理', '数据分析'],
        likes: 234,
        replies: 78,
        time: '2天前'
    }
];

const sampleLeaders = [
    { rank: 1, name: '数据分析师小王', title: '数据分析大师', posts: 156, likes: 2845 },
    { rank: 2, name: '项目经理小李', title: '项目管理专家', posts: 134, likes: 2156 },
    { rank: 3, name: '技术专家老陈', title: '技术布道师', posts: 98, likes: 1876 },
    { rank: 4, name: '产品经理小刘', title: '产品运营达人', posts: 87, likes: 1543 },
    { rank: 5, name: '职场导师Amy', title: '职场沟通专家', posts: 76, likes: 1234 },
    { rank: 6, name: '学习达人Mike', title: '全栈学习者', posts: 65, likes: 1087 },
    { rank: 7, name: '效率专家Lisa', title: '时间管理高手', posts: 54, likes: 965 },
    { rank: 8, name: '团队Leader老王', title: '领导力导师', posts: 43, likes: 854 }
];

// 渲染帖子列表
function renderPosts(posts) {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">${post.avatar}</div>
                <div class="post-meta">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${post.time}</div>
                </div>
                <span class="post-category">${post.category}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
            <div class="post-footer">
                <button class="post-action like-btn ${isLiked(post.id) ? 'liked' : ''}" data-post-id="${post.id}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14C8 14 14 9.5 14 5.5C14 3.567 12.433 2 10.5 2C9.113 2 7.863 2.825 7.5 4.1C7.137 2.825 5.887 2 4.5 2C2.567 2 1 3.567 1 5.5C1 9.5 7 14 7 14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span class="like-count">${post.likes}</span>
                </button>
                <button class="post-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 2H2C1.45 2 1 2.45 1 3V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V3C15 2.45 14.55 2 14 2ZM14 13H2V3H14V13Z" fill="currentColor"/>
                    </svg>
                    <span>${post.replies}</span>
                </button>
                <button class="post-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0ZM14 14H2V8H14V14ZM14 6H2V2H14V6Z" fill="currentColor"/>
                    </svg>
                    分享
                </button>
            </div>
        </div>
    `).join('');
    
    // 绑定点赞事件
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });
}

// 渲染分享列表
function renderShared() {
    const sharedList = document.getElementById('sharedList');
    if (!sharedList) return;
    
    const sharedPosts = samplePosts.filter(post => post.category === '经验分享');
    
    sharedList.innerHTML = sharedPosts.map(post => `
        <div class="shared-card">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="shared-author">
                <span>${post.author}</span>
                <span>•</span>
                <span>${post.time}</span>
            </div>
        </div>
    `).join('');
}

// 渲染问答列表
function renderQA() {
    const qaList = document.getElementById('qaList');
    if (!qaList) return;
    
    const qaPosts = [
        {
            question: '数据分析应该如何入门？',
            answers: 12,
            author: '新人小王',
            time: '3小时前'
        },
        {
            question: '职场沟通中如何优雅地拒绝不合理的需求？',
            answers: 23,
            author: '产品经理小李',
            time: '6小时前'
        },
        {
            question: '时间管理有哪些有效的方法？',
            answers: 18,
            author: '项目经理老陈',
            time: '1天前'
        }
    ];
    
    qaList.innerHTML = qaPosts.map(qa => `
        <div class="qa-card">
            <div class="qa-question">${qa.question}</div>
            <div class="qa-meta">
                <span style="color: var(--text-muted); font-size: 0.875rem;">${qa.author}</span>
                <span style="color: var(--text-muted); font-size: 0.875rem;">${qa.time}</span>
                <span style="color: var(--success-green); font-size: 0.875rem;">${qa.answers} 个回答</span>
            </div>
        </div>
    `).join('');
}

// 渲染达人榜
function renderLeaders() {
    const leadersList = document.getElementById('leadersList');
    if (!leadersList) return;
    
    leadersList.innerHTML = sampleLeaders.map(leader => {
        let rankClass = 'normal';
        if (leader.rank === 1) rankClass = 'gold';
        else if (leader.rank === 2) rankClass = 'silver';
        else if (leader.rank === 3) rankClass = 'bronze';
        
        return `
            <div class="leader-card">
                <div class="leader-rank ${rankClass}">${leader.rank}</div>
                <div class="leader-info">
                    <div class="leader-name">${leader.name}</div>
                    <div class="leader-title">${leader.title}</div>
                </div>
                <div class="leader-stats">
                    <div class="leader-stat">
                        <div class="leader-stat-value">${leader.posts}</div>
                        <div class="leader-stat-label">发帖</div>
                    </div>
                    <div class="leader-stat">
                        <div class="leader-stat-value">${leader.likes}</div>
                        <div class="leader-stat-label">获赞</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染最近活跃
function renderRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;
    
    const activities = [
        { user: '数据分析师小王', action: '发布了新帖', time: '2分钟前' },
        { user: '项目经理小李', action: '回复了帖子', time: '15分钟前' },
        { user: '技术专家老陈', action: '获得新成就', time: '1小时前' },
        { user: '产品经理小刘', action: '发布了新帖', time: '2小时前' }
    ];
    
    recentActivity.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-avatar">${activity.user[0]}</div>
            <div class="activity-content">${activity.user}${activity.action}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// 检查是否已点赞
function isLiked(postId) {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return userData?.community?.likes?.includes(postId) || false;
}

// 处理点赞
function handleLike(event) {
    const btn = event.currentTarget;
    const postId = parseInt(btn.dataset.postId);
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initializeCommunity();
    
    if (!userData.community.likes) {
        userData.community.likes = [];
    }
    
    const likeIndex = userData.community.likes.indexOf(postId);
    
    if (likeIndex > -1) {
        userData.community.likes.splice(likeIndex, 1);
        btn.classList.remove('liked');
    } else {
        userData.community.likes.push(postId);
        btn.classList.add('liked');
        userData.totalPoints += 5;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    
    // 更新点赞数
    const countSpan = btn.querySelector('.like-count');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = likeIndex > -1 ? currentCount - 1 : currentCount + 1;
    }
}

// 设置标签切换
function setupTabs() {
    const navItems = document.querySelectorAll('.community-nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.dataset.tab;
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 设置模态框
function setupModal() {
    const newPostBtn = document.getElementById('newPostBtn');
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const postModal = document.getElementById('postModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelPostBtn = document.getElementById('cancelPostBtn');
    const submitPostBtn = document.getElementById('submitPostBtn');
    
    function openModal() {
        postModal.classList.remove('hidden');
        postModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        postModal.classList.remove('active');
        postModal.classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('postForm').reset();
    }
    
    if (newPostBtn) {
        newPostBtn.addEventListener('click', openModal);
    }
    
    if (askQuestionBtn) {
        askQuestionBtn.addEventListener('click', () => {
            document.getElementById('postCategory').value = 'qa';
            openModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelPostBtn) {
        cancelPostBtn.addEventListener('click', closeModal);
    }
    
    if (postModal) {
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                closeModal();
            }
        });
    }
    
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', handleSubmitPost);
    }
}

// 处理提交帖子
function handleSubmitPost() {
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value;
    
    if (!title || !category || !content) {
        alert('请填写必填项');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initializeCommunity();
    
    const newPost = {
        id: Date.now(),
        author: '我',
        avatar: '我',
        title: title,
        excerpt: content.substring(0, 150),
        category: category === 'qa' ? '问答' : category === 'shared' ? '经验分享' : '讨论区',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        likes: 0,
        replies: 0,
        time: '刚刚'
    };
    
    userData.community.posts.unshift(newPost);
    userData.totalPoints += 20;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    
    // 关闭模态框
    document.getElementById('postModal').classList.remove('active');
    document.getElementById('postModal').classList.add('hidden');
    document.body.style.overflow = '';
    document.getElementById('postForm').reset();
    
    // 重新渲染
    renderPosts(samplePosts);
    
    alert('发布成功！获得20积分');
}

// 更新用户积分显示
function updatePointsDisplay() {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const myPoints = document.getElementById('myPoints');
    
    if (myPoints && userData) {
        myPoints.textContent = userData.totalPoints || 0;
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
    initializeCommunity();
    setupNavigation();
    setupTabs();
    setupModal();
    
    renderPosts(samplePosts);
    renderShared();
    renderQA();
    renderLeaders();
    renderRecentActivity();
    updatePointsDisplay();
});
