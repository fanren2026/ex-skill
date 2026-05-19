import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Award, Calendar, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useAppStore } from '../store/useAppStore';
import { skillCategories, achievements } from '../data/mockData';
import { calculateOverallProgress, getCategoryName } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ProgressCenter() {
  const navigate = useNavigate();
  const { progress, weaknesses, earnedBadges } = useAppStore();

  const overallProgress = calculateOverallProgress(progress);
  const completedCourses = Object.keys(progress).filter(id => progress[id].progress === 100).length;
  const totalCourses = skillCategories.flatMap(cat => cat.courses).length;

  const progressData = {
    labels: ['已完成', '进行中', '未开始'],
    datasets: [
      {
        data: [completedCourses, Object.keys(progress).length - completedCourses, totalCourses - Object.keys(progress).length],
        backgroundColor: ['#10B981', '#3B82F6', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const categoryProgress = skillCategories.map(category => {
    const catProgress = category.courses.map(course => progress[course.id]?.progress || 0);
    const avgProgress = catProgress.length > 0 
      ? Math.round(catProgress.reduce((a, b) => a + b, 0) / catProgress.length) 
      : 0;
    return { name: category.name, progress: avgProgress, color: category.color };
  });

  const barData = {
    labels: categoryProgress.map(c => c.name),
    datasets: [
      {
        label: '蒸馏进度',
        data: categoryProgress.map(c => c.progress),
        backgroundColor: categoryProgress.map(c => c.color),
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const unlockedAchievements = achievements.filter(a => earnedBadges.includes(a.id));
  const lockedAchievements = achievements.filter(a => !earnedBadges.includes(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>蒸馏进度</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            我的技能蒸馏之旅
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            实时追踪学习进度，发现薄弱环节，见证每一次成长
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">总体蒸馏进度</p>
                <p className="text-3xl font-bold text-gray-900">{overallProgress}%</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">已完成课程</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses}/{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">获得成就</p>
                <p className="text-3xl font-bold text-gray-900">{unlockedAchievements.length}/{achievements.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">薄弱环节</p>
                <p className="text-3xl font-bold text-gray-900">{weaknesses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              课程完成情况
            </h3>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={progressData} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              分类蒸馏进度
            </h3>
            <div className="h-64">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {weaknesses.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              需要加强的薄弱环节
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weaknesses.map((weakness) => (
                <div 
                  key={weakness.moduleId} 
                  className="bg-white rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{weakness.topic}</p>
                    <p className="text-sm text-gray-500">{getCategoryName(weakness.courseId.split('-')[0])}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/learn/${weakness.courseId.split('-')[0]}/${weakness.courseId.split('-')[1]}`)}
                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                  >
                    重新学习
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            成就徽章
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = earnedBadges.includes(achievement.id);
              return (
                <div 
                  key={achievement.id}
                  className={`relative rounded-xl p-4 text-center transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    isUnlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gray-300'
                  }`}>
                    <span className="text-xl">🏆</span>
                  </div>
                  <p className={`font-medium text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {achievement.name}
                  </p>
                  <p className={`text-xs mt-1 ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                    {isUnlocked ? achievement.description : '未解锁'}
                  </p>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs text-center px-2">{achievement.requirement}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">继续你的蒸馏之旅</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/learn')}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">开始新的课程</p>
            </button>
            <button 
              onClick={() => navigate('/recommend')}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
            >
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">智能学习推荐</p>
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">加入社区交流</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}