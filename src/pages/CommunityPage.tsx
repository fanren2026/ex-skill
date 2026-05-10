import { useEffect, useState } from 'react';
import { useCommunityStore } from '../stores/communityStore';
import { useUserStore } from '../stores/userStore';
import { Heart, MessageCircle, Send, Globe, Filter, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Language } from '../types';

const languageLabels: Record<string, string> = {
  en: '🇬🇧 英语',
  ja: '🇯🇵 日语',
  ko: '🇰🇷 韩语',
};

const languageColors: Record<string, string> = {
  en: 'bg-blue-100 text-blue-700',
  ja: 'bg-pink-100 text-pink-700',
  ko: 'bg-purple-100 text-purple-700',
};

export default function CommunityPage() {
  const { user } = useUserStore();
  const { posts, isLoading, fetchPosts, createPost, likePost, filterLanguage, setFilterLanguage } = useCommunityStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostLanguage, setSelectedPostLanguage] = useState<Language>('en');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    await createPost(newPostContent, selectedPostLanguage);
    setNewPostContent('');
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    await likePost(postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">学习社区</h1>
          <p className="text-slate-500">与全球学习者交流心得</p>
        </div>

        {user && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
            <form onSubmit={handleCreatePost}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.nickname?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="分享你的学习心得..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <select
                      value={selectedPostLanguage}
                      onChange={(e) => setSelectedPostLanguage(e.target.value as Language)}
                      className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="en">🇬🇧 英语</option>
                      <option value="ja">🇯🇵 日语</option>
                      <option value="ko">🇰🇷 韩语</option>
                    </select>
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      发布
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterLanguage(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterLanguage === null
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            全部
          </button>
          {(['en', 'ja', 'ko'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLanguage(lang)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterLanguage === lang
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-slate-900">{post.authorName}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${languageColors[post.language]}`}>
                        {languageLabels[post.language]}
                      </span>
                      <span className="text-sm text-slate-400">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: zhCN })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无帖子</h3>
            <p className="text-slate-500">成为第一个发帖的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
