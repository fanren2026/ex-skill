import React, { useEffect, useState } from 'react';
import { 
  Shield, Search, Plus, MessageCircle, ThumbsUp, Eye, 
  Pin, Award, Filter, ChevronRight, X, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useCommunityStore } from '../stores/communityStore';
import { format } from 'date-fns';
import type { PostCategory, SubjectType } from '../types';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const { 
    posts, 
    loadPosts, 
    createPost, 
    likePost, 
    filter, 
    setFilter,
    isLoading 
  } = useCommunityStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('discussion');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const categories: { value: PostCategory; label: string }[] = [
    { value: 'technique', label: '技巧分享' },
    { value: 'discussion', label: '讨论交流' },
    { value: 'help', label: '求助问答' },
    { value: 'sharing', label: '经验心得' }
  ];

  const subjects: { value: SubjectType; label: string }[] = [
    { value: 'science', label: '理工科' },
    { value: 'humanities', label: '人文社科' },
    { value: 'medicine', label: '医学' },
    { value: 'law', label: '法学' },
    { value: 'other', label: '其他' }
  ];

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await createPost({
        userId: user.id,
        user,
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        likes: 0,
        comments: 0,
        views: 0,
        isPinned: false,
        isFeatured: false,
        tags: []
      });
      setShowCreateModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('discussion');
    } catch (error) {
      console.error('创建帖子失败:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await likePost(postId);
  };

  const handleSearch = () => {
    setFilter({ keyword: searchKeyword });
    loadPosts({ ...filter, keyword: searchKeyword });
  };

  const getCategoryColor = (category: PostCategory) => {
    switch (category) {
      case 'technique': return 'bg-blue-100 text-blue-700';
      case 'discussion': return 'bg-green-100 text-green-700';
      case 'help': return 'bg-orange-100 text-orange-700';
      case 'sharing': return 'bg-purple-100 text-purple-700';
    }
  };

  const getCategoryLabel = (category: PostCategory) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">社区</h1>
            <p className="text-slate-600">分享降AI技巧，讨论学术写作</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              发布帖子
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="col-span-3 space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="搜索帖子..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filter.category || ''}
                  onChange={(e) => {
                    const value = e.target.value as PostCategory | '';
                    setFilter({ category: value || undefined });
                    loadPosts({ ...filter, category: value || undefined });
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部分类</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <select
                  value={filter.subject || ''}
                  onChange={(e) => {
                    const value = e.target.value as SubjectType | '';
                    setFilter({ subject: value || undefined });
                    loadPosts({ ...filter, subject: value || undefined });
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部学科</option>
                  {subjects.map((sub) => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.nickname}`}
                        alt={post.user.nickname}
                        className="w-10 h-10 rounded-full bg-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{post.user.nickname}</span>
                          {post.user.role === 'verified' && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">认证</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isPinned && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                          <Pin className="w-3 h-3" />
                          置顶
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(post.category)}`}>
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <Link to={`/community/${post.id}`} className="block mb-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 line-clamp-3">{post.content}</p>
                  </Link>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <Link 
                      to={`/community/${post.id}`}
                      className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </Link>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Eye className="w-5 h-5" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">暂无帖子</p>
                  {isAuthenticated ? (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      成为第一个发帖的人
                    </button>
                  ) : (
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      登录后发布帖子
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            {isAuthenticated && user ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-center mb-4">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`}
                    alt={user.nickname}
                    className="w-16 h-16 rounded-full mx-auto mb-3 bg-slate-200"
                  />
                  <h3 className="font-bold text-slate-900">{user.nickname}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-600">{user.stats.totalDetections}</p>
                    <p className="text-xs text-slate-500">检测次数</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{user.achievements.length}</p>
                    <p className="text-xs text-slate-500">成就数</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">加入社区</h3>
                <p className="text-sm text-blue-100 mb-4">登录后可以发布帖子、评论互动</p>
                <Link
                  to="/login"
                  className="block w-full py-2 bg-white text-blue-600 rounded-lg font-medium text-center hover:bg-blue-50 transition-colors"
                >
                  登录
                </Link>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                分类浏览
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setFilter({ category: cat.value });
                      loadPosts({ ...filter, category: cat.value });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      filter.category === cat.value 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                原创力榜单
              </h3>
              <div className="space-y-3">
                {[
                  { name: '学术小能手', streak: 30, rate: 12 },
                  { name: '降AI达人', streak: 20, rate: 18 },
                  { name: '论文研究者', streak: 50, rate: 8 },
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-slate-200 text-slate-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">连续{user.streak}天 · AIGC率{user.rate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">发布帖子</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">标题</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="请输入帖子标题"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">分类</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setNewPostCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          newPostCategory === cat.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">内容</label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="请输入帖子内容..."
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  发布
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
