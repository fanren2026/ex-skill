import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useUserStore } from '../stores/userStore';
import { useAchievementStore } from '../stores/achievementStore';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Flame, Target, Trophy, Clock, Calendar, TrendingUp, Award, BookOpen, Mic, Headphones, PenTool, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const levelColors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#dc2626'];

export default function ProgressPage() {
  const { user } = useUserStore();
  const { progress, todayStudyMinutes, weeklyStreak, fetchProgress } = useProgressStore();
  const { achievements, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    if (user) {
      fetchProgress(user.id);
      fetchAchievements();
    }
  }, [user, fetchProgress, fetchAchievements]);

  const abilityData = progress ? [
    { subject: '词汇', value: progress.abilityScores.vocabulary, fullMark: 100 },
    { subject: '语法', value: progress.abilityScores.grammar, fullMark: 100 },
    { subject: '口语', value: progress.abilityScores.speaking, fullMark: 100 },
    { subject: '听力', value: progress.abilityScores.listening, fullMark: 100 },
  ] : [];

  const weeklyData = progress ? [
    { day: '周一', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周二', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周三', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周四', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周五', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周六', minutes: Math.floor(Math.random() * 60 + 20) },
    { day: '周日', minutes: Math.floor(Math.random() * 60 + 20) },
  ] : [];

  const getCalendarDays = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 35 }, (_, i) => {
      const date = addDays(start, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasStudy = progress?.studyCalendar[dateStr];
      return { date, dateStr, hasStudy, isToday: dateStr === format(today, 'yyyy-MM-dd') };
    });
  };

  const calendarDays = getCalendarDays();
  const currentLevelIndex = LEVELS.indexOf(user?.currentLevel || 'A1');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">学习进度</h1>
          <p className="text-slate-500">追踪你的学习旅程</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm text-slate-500">连续学习</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{weeklyStreak} <span className="text-base font-normal text-slate-400">天</span></div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-slate-500">今日学习</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{todayStudyMinutes} <span className="text-base font-normal text-slate-400">分钟</span></div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-slate-500">总经验值</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{user?.totalXp || 0} <span className="text-base font-normal text-slate-400">XP</span></div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm text-slate-500">学习目标</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{progress?.weeklyAchieved || 0} <span className="text-base font-normal text-slate-400">/ {progress?.weeklyGoal || 300}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">能力雷达图</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={abilityData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 14 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar name="能力值" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">本周学习时长</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                    formatter={(value: number) => [`${value} 分钟`, '学习时长']}
                  />
                  <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                    {weeklyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                    ))}
                  </Bar>
                  <defs>
                    {weeklyData.map((_, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={levelColors[currentLevelIndex]} />
                        <stop offset="100%" stopColor={levelColors[currentLevelIndex]} stopOpacity={0.6} />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">学习日历</h2>
              <span className="text-sm text-slate-400">{format(new Date(), 'yyyy年 MM月', { locale: zhCN })}</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                <div key={day} className="text-center text-xs text-slate-400 font-medium py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map(({ date, hasStudy, isToday }) => (
                <div
                  key={date.toISOString()}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    hasStudy 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-400'
                  } ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                >
                  {format(date, 'd')}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">能力等级</h2>
              <span className="text-sm text-indigo-600 font-medium">{user?.currentLevel || 'A1'}</span>
            </div>
            <div className="space-y-4">
              {LEVELS.map((level, index) => (
                <div key={level} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${index <= currentLevelIndex ? 'bg-gradient-to-br ' + levelColors[index] : 'bg-slate-200'}`}>
                    {level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {level === 'A1' ? '入门' : level === 'A2' ? '初级' : level === 'B1' ? '中级' : level === 'B2' ? '中高级' : level === 'C1' ? '高级' : '精通'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {index < currentLevelIndex ? '已完成' : index === currentLevelIndex ? '进行中' : '未开始'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: index < currentLevelIndex ? '100%' : index === currentLevelIndex ? '60%' : '0%',
                          background: `linear-gradient(to right, ${levelColors[index]}, ${levelColors[index]}99)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">学习统计</h2>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{progress?.vocabularyMastered || 0}</div>
              <div className="text-sm text-slate-500">掌握词汇</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-50 flex items-center justify-center">
                <PenTool className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{progress?.grammarCompleted || 0}</div>
              <div className="text-sm text-slate-500">语法掌握</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                <Mic className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{progress?.speakingMinutes || 0}</div>
              <div className="text-sm text-slate-500">口语分钟</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{(progress?.listeningHours || 0).toFixed(1)}</div>
              <div className="text-sm text-slate-500">听力小时</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">成就徽章</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {achievements.slice(0, 7).map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-4 border border-slate-200 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${
                  achievement.unlockedAt ? '' : 'opacity-50 grayscale'
                }`}
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  achievement.unlockedAt ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-200'
                }`}>
                  <Trophy className={`w-7 h-7 ${achievement.unlockedAt ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{achievement.name}</h3>
                <p className="text-xs text-slate-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
