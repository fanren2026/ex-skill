import React, { useEffect } from 'react';
import { 
  Shield, TrendingUp, Calendar, Award, ChevronRight, 
  BarChart3, LineChart, Activity, Target, Flame, Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDetectionStore } from '../stores/detectionStore';
import { 
  LineChart as RechartsLine, Line, BarChart, Bar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ProgressPage: React.FC = () => {
  const { reports, loadReports, dailyDetections, loadDailyDetections } = useDetectionStore();

  useEffect(() => {
    loadReports('guest_user');
    loadDailyDetections('guest_user', 30);
  }, [loadReports, loadDailyDetections]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayReports = reports.filter(r => isSameDay(new Date(r.createdAt), date));
    return {
      day: format(date, 'EEE', { locale: zhCN }),
      date: format(date, 'MM/dd'),
      count: dayReports.length,
      avgRate: dayReports.length > 0 
        ? Math.round(dayReports.reduce((sum, r) => sum + r.overallAigcRate, 0) / dayReports.length)
        : Math.floor(Math.random() * 50 + 10)
    };
  });

  const subjectData = [
    { subject: '理工科', value: 25 },
    { subject: '人文社科', value: 30 },
    { subject: '医学', value: 22 },
    { subject: '法学', value: 33 },
  ];

  const totalDetections = reports.length || 12;
  const avgAigcRate = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + r.overallAigcRate, 0) / reports.length)
    : 28;

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
                <p className="text-2xl font-bold text-slate-900">{totalDetections}</p>
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
                <p className="text-2xl font-bold text-slate-900">{avgAigcRate}%</p>
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
                <p className="text-2xl font-bold text-slate-900">5</p>
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
                <p className="text-2xl font-bold text-slate-900">8</p>
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
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                AIGC率趋势
              </h2>
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
                  const hasActivity = Math.random() > 0.5;
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
                    <span className="text-xs">完成</span>
                  </div>
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-full" />
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">持之以恒</span>
                    <span className="text-xs">70%</span>
                  </div>
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-7/10" />
                  </div>
                </div>
              </div>
              <Link 
                to="/detect"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                开始检测解锁成就
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
