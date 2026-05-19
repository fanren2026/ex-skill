import { useState } from 'react';
import { Users, MessageSquare, Heart, Share2, Award, Send, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { communityPosts, achievements } from '../data/mockData';
import { formatDate, getCategoryName } from '../utils/helpers';
import { CommunityPost } from '../types';

export default function CommunityPage() {
  const { earnedBadges } = useAppStore();
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'career' });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) return;
    
    const post: CommunityPost = {
      id: `p${Date.now()}`,
      userId: 'current-user',
      userName: '学习者',
      avatar: 'User',
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      createdAt: new Date(),
      likes: 0,
      liked: false
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'career' });
    setShowNewPostModal(false);
  };

  const unlockedAchievements = achievements.filter(a => earnedBadges.includes(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
            <Users className="w-4 h-4" />
            <span>学习社区</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            技能蒸馏社区
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            与志同道合的学习者交流经验，分享技能蒸馏心得，共同成长进步
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                最新讨论
              </h2>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                发布心得
              </button>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{post.title}</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {getCategoryName(post.category)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{post.userName}</span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                              post.liked
                                ? 'bg-red-50 text-red-500'
                                : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                            <Share2 className="w-4 h-4" />
                            分享
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                我的成就
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                      <div className="w-10 h-10 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-lg">🏆</span>
                      </div>
                      <p className="font-medium text-sm text-gray-900">{achievement.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>还没有获得任何成就</p>
                    <p className="text-sm">完成课程学习即可获得成就徽章</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">社区规则</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>分享真实的学习经验和心得</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>尊重他人，友善交流</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>禁止发布广告和无关内容</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                  <span>保护个人隐私信息</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">热门话题</h3>
              <div className="space-y-2">
                {['职场沟通技巧', '时间管理方法', '编程入门指南', '批判性思维训练'].map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">发布学习心得</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入标题"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="career">职场核心技能</option>
                    <option value="general">通用能力</option>
                    <option value="technical">专业技术</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={4}
                    placeholder="分享你的学习心得..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    disabled={!newPost.title || !newPost.content}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发布
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}