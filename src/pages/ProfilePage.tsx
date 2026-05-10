import React, { useState } from 'react';
import { 
  Shield, Settings, Award, FileText, LogOut, 
  ChevronRight, Edit2, Lock, Bell, Moon, 
  Download, Share2, CheckCircle2, Star, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useDetectionStore } from '../stores/detectionStore';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUserStore();
  const { reports, loadReports } = useDetectionStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'achievements' | 'settings'>('overview');

  React.useEffect(() => {
    if (user) {
      loadReports(user.id);
    }
  }, [user, loadReports]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">登录后查看个人中心</h1>
          <p className="text-slate-600 mb-8">登录后即可查看您的个人信息和检测记录</p>
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: <Shield className="w-5 h-5" /> },
    { id: 'reports', label: '检测报告', icon: <FileText className="w-5 h-5" /> },
    { id: 'achievements', label: '成就徽章', icon: <Award className="w-5 h-5" /> },
    { id: 'settings', label: '设置', icon: <Settings className="w-5 h-5" /> }
  ];

  const achievements = [
    { id: 'ach_first_detect', name: '初试锋芒', desc: '完成首次检测', icon: '⭐', rarity: 'common', unlocked: user.stats.totalDetections >= 1 },
    { id: 'ach_sincere', name: '句句真心', desc: 'AIGC率<10%', icon: '🖋️', rarity: 'rare', unlocked: user.stats.avgAigcRate < 10 },
    { id: 'ach_streak_7', name: '持之以恒', desc: '连续7天检测', icon: '📅', rarity: 'common', unlocked: user.stats.currentStreak >= 7 },
    { id: 'ach_logic_master', name: '逻辑大师', desc: '5次无逻辑错误', icon: '🧠', rarity: 'epic', unlocked: false },
    { id: 'ach_ten_detect', name: '深度探索者', desc: '完成10次检测', icon: '🔬', rarity: 'rare', unlocked: user.stats.totalDetections >= 10 },
    { id: 'ach_streak_30', name: '原创卫士', desc: '连续30天AIGC<5%', icon: '🛡️', rarity: 'legendary', unlocked: user.stats.currentStreak >= 30 },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-amber-400 to-amber-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`}
                alt={user.nickname}
                className="w-24 h-24 rounded-full bg-slate-200"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{user.nickname}</h1>
                  {user.role === 'verified' && (
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">认证用户</span>
                  )}
                  {user.role === 'admin' && (
                    <span className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">管理员</span>
                  )}
                </div>
                <p className="text-slate-600 mb-4">{user.email}</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xl font-bold text-slate-900">{user.stats.totalDetections}</p>
                    <p className="text-sm text-slate-500">检测次数</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{user.stats.avgAigcRate}%</p>
                    <p className="text-sm text-slate-500">平均AIGC率</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600">{user.stats.currentStreak}</p>
                    <p className="text-sm text-slate-500">连续天数</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-600">{user.achievements.length}</p>
                    <p className="text-sm text-slate-500">已获成就</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="col-span-2 space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">开始新的检测</h3>
                    <p className="text-blue-100 mb-4">上传您的论文，获取专业的AIGC率分析报告</p>
                    <Link
                      to="/detect"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                    >
                      立即检测
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-4">最近检测</h3>
                    <div className="space-y-3">
                      {reports.slice(0, 3).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              report.overallAigcRate < 30 ? 'bg-green-500' :
                              report.overallAigcRate < 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-slate-900">论文 #{report.paperId.slice(-6)}</p>
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
                            <p className="text-xs text-slate-500">AIGC率</p>
                          </div>
                        </div>
                      ))}
                      {reports.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          暂无检测记录
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      成就进度
                    </h3>
                    <div className="space-y-3">
                      {achievements.filter(a => !a.unlocked).slice(0, 2).map((ach) => (
                        <div key={ach.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-lg opacity-50">
                            {ach.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">{ach.name}</p>
                            <p className="text-xs text-slate-500">{ach.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link 
                      to="/profile/achievements"
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      查看全部成就
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      原创力提升建议
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• 增加原创性分析和见解</li>
                      <li>• 避免过度使用AI典型词汇</li>
                      <li>• 保持写作风格一致性</li>
                      <li>• 引用真实可靠的文献</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">全部检测报告</h3>
                  <span className="text-sm text-slate-500">{reports.length} 条记录</span>
                </div>
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        report.overallAigcRate < 30 ? 'bg-green-100 text-green-600' :
                        report.overallAigcRate < 70 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">论文 #{report.paperId.slice(-6)}</p>
                        <p className="text-sm text-slate-500">
                          {format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm')} · 
                          {report.detectionLevel === 'basic' ? '初级' : 
                           report.detectionLevel === 'standard' ? '标准' : '深度'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          report.overallAigcRate < 30 ? 'text-green-600' :
                          report.overallAigcRate < 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {report.overallAigcRate}%
                        </p>
                        <p className="text-xs text-slate-500">AIGC率</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors" title="下载">
                          <Download className="w-5 h-5 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors" title="分享">
                          <Share2 className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {reports.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">暂无检测报告</p>
                    <Link to="/detect" className="text-blue-600 hover:text-blue-700 font-medium">
                      开始第一次检测
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-3 gap-6">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      ach.unlocked 
                        ? `bg-gradient-to-br ${getRarityColor(ach.rarity)} text-white border-transparent` 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`text-4xl mb-4 ${ach.unlocked ? '' : 'grayscale'}`}>
                      {ach.icon}
                    </div>
                    <h4 className="font-bold mb-1">{ach.name}</h4>
                    <p className={`text-sm ${ach.unlocked ? 'text-white/80' : 'text-slate-500'}`}>
                      {ach.desc}
                    </p>
                    {ach.unlocked ? (
                      <div className="mt-4 flex items-center gap-1 text-white/90">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">已解锁</span>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white/50 rounded-full" style={{ width: '30%' }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">进行中</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl">
                      <Edit2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">编辑个人信息</p>
                      <p className="text-sm text-slate-500">修改昵称、头像等</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl">
                      <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">修改密码</p>
                      <p className="text-sm text-slate-500">更新您的账户密码</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl">
                      <Bell className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">通知设置</p>
                      <p className="text-sm text-slate-500">管理您的通知偏好</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl">
                      <Moon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">外观设置</p>
                      <p className="text-sm text-slate-500">选择主题和显示效果</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
