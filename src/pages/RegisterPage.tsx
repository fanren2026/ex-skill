import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import type { RegisterData, UserType } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useUserStore();
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    nickname: '',
    phone: '',
    userType: 'personal',
    institutionType: undefined,
    institutionName: '',
    researchField: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    const labels = ['弱', '较弱', '中等', '强'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    return { label: labels[strength], color: colors[strength] };
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.nickname) {
      errors.nickname = '请输入昵称';
    } else if (formData.nickname.length < 2) {
      errors.nickname = '昵称至少2个字符';
    }
    
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码至少6个字符';
    }
    
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (!agreeTerms) {
      errors.terms = '请阅读并同意用户协议';
    }
    
    if (formData.userType === 'institutional') {
      if (!formData.institutionName) {
        errors.institutionName = '请输入机构名称';
      }
      if (!formData.institutionType) {
        errors.institutionType = '请选择机构类型';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    const success = await register(formData);
    if (success) {
      navigate('/detect');
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setFormData({
      ...formData,
      userType: type,
      institutionType: type === 'institutional' ? 'university' : undefined,
      institutionName: type === 'institutional' ? formData.institutionName : ''
    });
  };

  const strength = passwordStrength(formData.password);
  const strengthInfo = getStrengthLabel(strength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">真写·检测</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">创建账号</h1>
            <p className="text-slate-600">注册即送3次免费检测机会</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">账号类型</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('personal')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.userType === 'personal'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${formData.userType === 'personal' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <p className={`text-sm font-medium ${formData.userType === 'personal' ? 'text-blue-700' : 'text-slate-600'}`}>
                    个人用户
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('institutional')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.userType === 'institutional'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Shield className={`w-6 h-6 mx-auto mb-2 ${formData.userType === 'institutional' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <p className={`text-sm font-medium ${formData.userType === 'institutional' ? 'text-blue-700' : 'text-slate-600'}`}>
                    机构用户
                  </p>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {formErrors.email && <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>}
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">昵称</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="请输入昵称"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    formErrors.nickname ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {formErrors.nickname && <p className="mt-2 text-sm text-red-600">{formErrors.nickname}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码（至少6位）"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthInfo.color : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">密码强度：{strengthInfo.label}</p>
                </div>
              )}
              {formErrors.password && <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {formErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>}
            </div>

            {/* Institutional Fields */}
            {formData.userType === 'institutional' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">机构名称</label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="请输入机构名称"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      formErrors.institutionName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.institutionName && <p className="mt-2 text-sm text-red-600">{formErrors.institutionName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">机构类型</label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as RegisterData['institutionType'] })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      formErrors.institutionType ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                  >
                    <option value="">请选择机构类型</option>
                    <option value="university">高校</option>
                    <option value="journal">期刊编辑部</option>
                    <option value="research">科研机构</option>
                    <option value="other">其他</option>
                  </select>
                  {formErrors.institutionType && <p className="mt-2 text-sm text-red-600">{formErrors.institutionType}</p>}
                </div>
              </>
            )}

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">
                  我已阅读并同意
                  <a href="#" className="text-blue-600 hover:underline">《用户协议》</a>
                  和
                  <a href="#" className="text-blue-600 hover:underline">《隐私政策》</a>
                </span>
              </label>
              {formErrors.terms && <p className="mt-2 text-sm text-red-600">{formErrors.terms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  注册中...
                </span>
              ) : (
                '立即注册'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-slate-600">
            已有账号？{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              立即登录
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { icon: <CheckCircle2 className="w-5 h-5" />, text: '3次免费检测' },
            { icon: <CheckCircle2 className="w-5 h-5" />, text: '专业报告' },
            { icon: <CheckCircle2 className="w-5 h-5" />, text: '成就徽章' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur rounded-xl">
              <div className="text-blue-600">{item.icon}</div>
              <span className="text-sm text-slate-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
