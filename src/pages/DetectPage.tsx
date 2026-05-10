import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, FileText, Upload, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, Loader2, BarChart3, BookOpen, Scale, Microscope,
  FileCheck, Download, Share2, Copy, RefreshCw
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useDetectionStore } from '../stores/detectionStore';
import type { DetectionLevel, SubjectType } from '../types';

const DetectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const { 
    submitPaper, 
    startDetection, 
    currentPaper, 
    currentReport, 
    isDetecting, 
    progress, 
    reset 
  } = useDetectionStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [detectionLevel, setDetectionLevel] = useState<DetectionLevel>('standard');
  const [subject, setSubject] = useState<SubjectType>('science');
  const [showReport, setShowReport] = useState(false);

  const levels: { value: DetectionLevel; name: string; time: string; features: string[] }[] = [
    {
      value: 'basic',
      name: '初级筛查',
      time: '<30秒',
      features: ['快速识别明显AI段落', 'AIGC概率百分比', '基础修改建议']
    },
    {
      value: 'standard',
      name: '标准检测',
      time: '<2分钟',
      features: ['语义连贯性分析', '修辞模式识别', '章节报告', '详细建议']
    },
    {
      value: 'deep',
      name: '深度检测',
      time: '<5分钟',
      features: ['改写痕迹检测', '模板句式分析', '完整报告', '认证证书']
    }
  ];

  const subjects: { value: SubjectType; name: string }[] = [
    { value: 'science', name: '理工科' },
    { value: 'humanities', name: '人文社科' },
    { value: 'medicine', name: '医学' },
    { value: 'law', name: '法学' },
    { value: 'other', name: '其他' }
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请输入论文标题和内容');
      return;
    }

    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const wordCount = content.trim().length;
    
    try {
      const paper = await submitPaper({
        userId: user.id,
        title,
        content,
        wordCount,
        subject,
        detectionLevel,
        status: 'pending',
        version: 1
      });

      await startDetection(paper.id, detectionLevel);
      setShowReport(true);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const handleNewDetection = () => {
    reset();
    setTitle('');
    setContent('');
    setShowReport(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">登录后使用论文检测</h1>
          <p className="text-slate-600 mb-8">登录后即可体验完整的论文AIGC检测功能</p>
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

  if (showReport && currentReport) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Report Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentPaper?.title}</h1>
                <p className="text-slate-600">
                  检测时间：{new Date(currentReport.createdAt).toLocaleString('zh-CN')}
                  <span className="mx-3">|</span>
                  检测级别：{levels.find(l => l.value === currentReport.detectionLevel)?.name}
                  <span className="mx-3">|</span>
                  学科：{subjects.find(s => s.value === currentReport.subject)?.name}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <Download className="w-4 h-4" />
                  下载报告
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
                <button 
                  onClick={handleNewDetection}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新检测
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">{currentReport.overallAigcRate}%</div>
                <div className="text-sm text-slate-600">AIGC率</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {100 - currentReport.overallAigcRate}%
                </div>
                <div className="text-sm text-slate-600">原创度</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">{currentReport.paragraphResults.length}</div>
                <div className="text-sm text-slate-600">检测段落</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {currentReport.paragraphResults.filter(p => p.riskLevel === 'high').length}
                </div>
                <div className="text-sm text-slate-600">高风险段落</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Heatmap Section */}
            <div className="col-span-2 space-y-6">
              {/* Heatmap */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  全文热力图
                </h2>
                <div className="space-y-3">
                  {currentReport.paragraphResults.map((result, index) => (
                    <div key={index} className="relative">
                      <div 
                        className={`absolute left-0 top-0 bottom-0 rounded-lg ${getRiskBgColor(result.riskLevel)} opacity-20`}
                        style={{ width: `${result.aigcProbability}%` }}
                      />
                      <div className="relative p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">段落 {index + 1}</span>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(result.riskLevel)}`}>
                            {result.aigcProbability}% AI
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-2">{result.content}</p>
                        {result.issues.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2">
                              {result.issues.map((issue, i) => (
                                <span key={i} className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded">
                                  {issue.description}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  章节明细
                </h2>
                <div className="space-y-3">
                  {currentReport.sectionStats.map((section, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-24 font-medium text-slate-700">{section.name}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${section.aigcRate > 50 ? 'bg-red-500' : section.aigcRate > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${section.aigcRate}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right font-medium text-slate-700">{section.aigcRate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Patterns */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-blue-600" />
                  检测到的AI典型特征
                </h2>
                <div className="space-y-2">
                  {currentReport.fingerprintAnalysis.aiCommonPatterns.length > 0 ? (
                    currentReport.fingerprintAnalysis.aiCommonPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-700">{pattern.pattern}</span>
                        <span className="text-xs text-slate-500">置信度 {Math.round(pattern.confidence * 100)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">未检测到明显的AI典型特征</p>
                  )}
                </div>
              </div>

              {/* Logic Flaws */}
              {currentReport.logicFlaws.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-orange-600" />
                    逻辑漏洞扫描
                  </h2>
                  <div className="space-y-3">
                    {currentReport.logicFlaws.map((flaw, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-700">
                            {flaw.type === 'repetition' ? '论点重复' : 
                             flaw.type === 'causality' ? '因果模糊' : 
                             flaw.type === 'citation' ? '引用问题' : '逻辑问题'}
                          </span>
                        </div>
                        <p className="text-sm text-orange-600 mb-2">{flaw.description}</p>
                        <p className="text-xs text-orange-500">建议：{flaw.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {currentReport.suggestions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-green-600" />
                    修改建议
                  </h2>
                  <div className="space-y-3">
                    {currentReport.suggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 mb-2">{suggestion.suggestion}</p>
                        <p className="text-xs text-green-600">{suggestion.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">生成认证报告</h3>
                <p className="text-sm text-blue-100 mb-4">获取带有唯一验证码的官方检测证明</p>
                <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  生成证书
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">论文检测</h1>
          <p className="text-slate-600">上传您的论文，获取专业的AIGC率分析报告</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Input */}
          <div className="col-span-2 space-y-6">
            {/* Paper Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">论文信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">论文标题</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="请输入论文标题"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">论文内容</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请粘贴论文内容..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[400px] resize-y"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    当前字数：{content.length} 字
                  </p>
                </div>
              </div>
            </div>

            {/* Detection Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">检测设置</h2>
              
              {/* Detection Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">检测级别</label>
                <div className="grid grid-cols-3 gap-4">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setDetectionLevel(level.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        detectionLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900">{level.name}</span>
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{level.time}/万字</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {level.features.slice(0, 2).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">学科领域</label>
                <div className="flex flex-wrap gap-3">
                  {subjects.map((subj) => (
                    <button
                      key={subj.value}
                      onClick={() => setSubject(subj.value)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        subject === subj.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {subj.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Detection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">开始检测</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">检测级别</span>
                    <span className="font-medium text-slate-900">
                      {levels.find(l => l.value === detectionLevel)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">学科领域</span>
                    <span className="font-medium text-slate-900">
                      {subjects.find(s => s.value === subject)?.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isDetecting || !title.trim() || !content.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      检测中 {progress}%
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      开始检测
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress */}
            {isDetecting && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">检测进度</h3>
                <div className="mb-4">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 text-center">
                  正在分析论文内容，请稍候...
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                检测小贴士
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• 建议上传完整论文以获得最准确的结果</li>
                <li>• 深度检测可发现经过改写的AI内容</li>
                <li>• 检测结果仅供参考，请以实际审查为准</li>
              </ul>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">当前用户</h3>
              <div className="flex items-center gap-3">
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nickname}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full bg-slate-200"
                />
                <div>
                  <p className="font-medium text-slate-900">{user?.nickname}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{user?.stats.totalDetections || 0}</p>
                    <p className="text-xs text-slate-500">检测次数</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{user?.stats.avgAigcRate || 0}%</p>
                    <p className="text-xs text-slate-500">平均AIGC率</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectPage;
