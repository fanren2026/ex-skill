import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import { useUserStore } from '../stores/userStore';
import { ArrowRight, BookOpen, Headphones, Mic, PenTool, Trophy, Zap, Users, Star, Globe } from 'lucide-react';
import type { Language } from '../types';

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

const languageNames: Record<Language, string> = {
  en: '英语',
  ja: '日语',
  ko: '韩语',
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const features = [
  { icon: BookOpen, title: '单词记忆', description: '艾宾浩斯记忆曲线，科学复习', color: 'from-blue-500 to-cyan-500' },
  { icon: PenTool, title: '语法练习', description: '互动式练习，即时反馈', color: 'from-purple-500 to-pink-500' },
  { icon: Mic, title: '口语跟读', description: 'AI评分，提升发音', color: 'from-orange-500 to-red-500' },
  { icon: Headphones, title: '听力训练', description: '沉浸式听力场景', color: 'from-green-500 to-teal-500' },
];

const stats = [
  { icon: Users, value: '50,000+', label: '学习者' },
  { icon: BookOpen, value: '500+', label: '课程' },
  { icon: Trophy, value: '98%', label: '满意度' },
  { icon: Star, value: '4.9', label: '评分' },
];

export default function HomePage() {
  const { languages, courses, fetchCourses, selectLanguage } = useCourseStore();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleLanguageSelect = (lang: Language) => {
    selectLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-500/10 to-teal-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI 驱动的智能学习体验
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              用你的方式
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                学习世界语言
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8">
              沉浸式语言学习平台，支持英语、日语、韩语等多语种。
              告别枯燥，拥抱高效学习。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/learn/en/A1' : '/auth/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-1"
              >
                {isAuthenticated ? '继续学习' : '免费开始'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/progress"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border border-slate-200 transition-all hover:border-slate-300"
              >
                了解更多
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center border border-slate-200/50">
                <Icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">选择你的学习语言</h2>
            <p className="text-slate-600">开启你的语言学习之旅</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 rounded-3xl p-8 text-left border-2 border-transparent hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="text-6xl mb-4">{lang.flag}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{lang.name}</h3>
                <p className="text-slate-500">{lang.nativeName}</p>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">CEFR 分级课程体系</h2>
            <p className="text-slate-600">从零基础到精通，循序渐进</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {levels.map((level) => (
              <Link
                key={level}
                to={`/learn/en/${level}`}
                className="group relative bg-white hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 rounded-2xl p-6 text-center border border-slate-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="text-2xl font-bold text-slate-900 group-hover:text-white mb-2">{level}</div>
                <div className="text-xs text-slate-500 group-hover:text-indigo-100">
                  {level === 'A1' ? '入门' : level === 'A2' ? '初级' : level === 'B1' ? '中级' : level === 'B2' ? '中高级' : level === 'C1' ? '高级' : '精通'}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">互动式学习模块</h2>
            <p className="text-slate-600">全方位提升听说读写能力</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            准备好开始你的语言学习之旅了吗？
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            加入 thousands of learners，开始今天的学习。每天进步一点点，成为你想成为的人。
          </p>
          <Link
            to={isAuthenticated ? '/learn/en/A1' : '/auth/register'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-2xl transition-all hover:shadow-3xl hover:-translate-y-1"
          >
            {isAuthenticated ? '开始学习' : '立即注册'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">LinguaWorld</span>
            </div>
            <p className="text-sm">© 2024 LinguaWorld. 让语言学习更简单。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
