import React, { useEffect, useState } from 'react';
import { 
  Shield, TrendingUp, Calendar, Award, ChevronRight, 
  BarChart3, LineChart, Activity, Target, Flame, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useDetectionStore } from '../stores/detectionStore';
import { 
  LineChart as RechartsLine, Line, BarChart, Bar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const { reports, loadReports } = useDetectionStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    if (user && isAuthenticated) {
      loadReports(user.id);
    }
  }, [user, isAuthenticated, loadReports]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">登录后查看进度追踪</h1>
          <p className="text-slate-600 mb-8">登录后即可查看您的检测历史和进步趋势</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            登录
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayReports = reports.filter(r => isSameDay(new Date(r.createdAt), date));
    return {
      day: format(date, 'EEE', { locale: zhCN }),
      date: format(date, 'MM/dd'),
      count: dayReports.length,
      avgRate: dayReports.length > 0 
        ? Math.round(dayReports.reduce((sum, r) => sum + r.overallAigcRate, 0) / dayReports.length)
        : 0
    };
  });

  const subjectData = [
    { subject: '理工科', value: user.stats.avgAigcRate || 25 },
    { subject: '人文社科', value: (user.stats.avgAigcRate || 25) + 5 },
    { subject: '医学', value: (user.stats.avgAigcRate || 25) - 3 },
    { subject: '法学', value: (user.stats.avgAigcRate || 25) + 8 },
  ];

  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">进度追踪</h1>
          <p className="text-slate-600">追踪您的原创写作进步之路</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{user.stats.totalDetections}</p>
                <p className="text-sm text-slate-500">总检测次数</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{user.stats.avgAigcRate}%</p>
                <p className="text-sm text-slate-500">平均AIGC率</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{user.stats.currentStreak}</p>
                <p className="text-sm text-slate-500">连续检测天数</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{user.stats.longestStreak}</p>
                <p className="text-sm text-slate-500">最长连续天数</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="col-span-2 space-y-6">
            {/* Weekly Trend */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  AIGC率趋势
                </h2>
                <div className="flex gap-2">
                  {(['week', 'month', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        selectedPeriod === period
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {period === 'week' ? '本周' : period === 'month' ? '本月' : '全部'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLine data={weekDays}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'AIGC率']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgRate" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                周检测次数
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekDays}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  最近检测
                </h2>
                <Link to="/profile/reports" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  查看全部
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/report/${report.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          report.overallAigcRate < 30 ? 'bg-green-500' :
                          report.overallAigcRate < 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-slate-900">
                            论文 #{report.paperId.slice(-6)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          report.overallAigcRate < 30 ? 'text-green-600' :
                          report.overallAigcRate < 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {report.overallAigcRate}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {report.detectionLevel === 'basic' ? '初级' :
                           report.detectionLevel === 'standard' ? '标准' : '深度'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">暂无检测记录</p>
                    <Link 
                      to="/detect"
                      className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                    >
                      开始第一次检测
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Radar Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                学科AIGC率分布
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={subjectData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 60]} 
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                    />
                    <Radar
                      name="AIGC率"
                      dataKey="value"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                检测日历
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                  <div key={day} className="text-center text-xs text-slate-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const hasActivity = Math.random() > 0.6;
                  const intensity = Math.random();
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded ${
                        hasActivity
                          ? intensity > 0.7
                            ? 'bg-blue-600'
                            : intensity > 0.4
                            ? 'bg-blue-400'
                            : 'bg-blue-200'
                          : 'bg-slate-100'
                      }`}
                      title={hasActivity ? '已检测' : '未检测'}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-slate-100" />
                  <span>无</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-200" />
                  <span>少</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-400" />
                  <span>中</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span>多</span>
                </div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                成就进度
              </h2>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">初试锋芒</span>
                    <span className="text-xs">{Math.min(100, (user.stats.totalDetections / 1) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${Math.min(100, (user.stats.totalDetections / 1) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">持之以恒</span>
                    <span className="text-xs">{Math.min(100, (user.stats.currentStreak / 7) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${Math.min(100, (user.stats.currentStreak / 7) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link 
                to="/profile/achievements"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                查看全部成就
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
