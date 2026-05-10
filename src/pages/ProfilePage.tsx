import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { Camera, Save, User, Mail, Globe, Target, Trophy, LogOut, ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react';
import type { Language, Level } from '../types';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: '🇬🇧 英语' },
  { value: 'ja', label: '🇯🇵 日语' },
  { value: 'ko', label: '🇰🇷 韩语' },
];

const levelOptions: { value: Level; label: string }[] = [
  { value: 'A1', label: 'A1 - 入门' },
  { value: 'A2', label: 'A2 - 初级' },
  { value: 'B1', label: 'B1 - 中级' },
  { value: 'B2', label: 'B2 - 中高级' },
  { value: 'C1', label: 'C1 - 高级' },
  { value: 'C2', label: 'C2 - 精通' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [targetLanguage, setTargetLanguage] = useState<Language>(user?.targetLanguage || 'en');
  const [currentLevel, setCurrentLevel] = useState<Level>(user?.currentLevel || 'A1');

  if (!isAuthenticated || !user) {
    navigate('/auth/login');
    return null;
  }

  const handleSave = () => {
    updateUser({ nickname, targetLanguage, currentLevel });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Bell, label: '通知设置', description: '管理学习提醒和推送', color: 'bg-blue-100 text-blue-600' },
    { icon: Shield, label: '隐私安全', description: '账号和隐私设置', color: 'bg-green-100 text-green-600' },
    { icon: HelpCircle, label: '帮助中心', description: '常见问题和客服支持', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">个人中心</h1>
          <p className="text-slate-500">管理你的学习设置</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
                {user.nickname?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{user.nickname}</h2>
              <p className="text-indigo-100 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {user.totalXp} XP
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {user.currentLevel}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">个人信息</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  编辑
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNickname(user.nickname);
                      setTargetLanguage(user.targetLanguage);
                      setCurrentLevel(user.currentLevel);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-500 mb-1">昵称</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{user.nickname}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-500 mb-1">学习语言</label>
                {isEditing ? (
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value as Language)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {languageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-900 font-medium">{languageOptions.find(o => o.value === user.targetLanguage)?.label}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-500 mb-1">当前等级</label>
                {isEditing ? (
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as Level)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {levelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-900 font-medium">{levelOptions.find(o => o.value === user.currentLevel)?.label}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-500 mb-1">邮箱</label>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">设置</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {menuItems.map(({ icon: Icon, label, description, color }) => (
              <button
                key={label}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>
  );
}
