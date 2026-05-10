import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, BarChart3, Users, Award, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: '分级检测体系',
      description: '初级筛查、标准检测、深度检测三种模式，满足不同场景需求',
      details: ['<30秒快速筛查', '语义连贯性分析', '改写痕迹识别']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: '全文热力图',
      description: '红色高风险、黄色中等、绿色低风险，逐句标注AI贡献度',
      details: ['逐句概率标注', '章节明细报告', '版本对比曲线']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '学科定制',
      description: '针对理工科、人文社科、医学、法学等采用专属检测阈值',
      details: ['学科特征库', '专业术语识别', '引用规范校验']
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: '成就激励',
      description: '原创力榜单、成就徽章、公开认证报告，激发创作热情',
      details: ['句句真心徽章', '文献侦探认证', '原创卫士称号']
    }
  ];

  const detectionLevels = [
    {
      name: '初级筛查',
      time: '<30秒/万字',
      features: ['快速识别明显AI段落', 'AIGC概率百分比', '基础修改建议', '适合日常作业初审'],
      color: 'from-green-400 to-green-500'
    },
    {
      name: '标准检测',
      time: '<2分钟/万字',
      features: ['语义连贯性分析', '修辞模式识别', '句子复杂度统计', '详细修改建议', '章节报告'],
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      name: '深度检测',
      time: '<5分钟/万字',
      features: ['同义词替换检测', '语序调整识别', '模板句式分析', '深度语义分析', '完整报告', '认证证书'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { value: '100,000+', label: '已检测论文' },
    { value: '98.5%', label: '检测准确率' },
    { value: '50,000+', label: '活跃用户' },
    { value: '30+', label: '覆盖学科' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">真写·检测</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/detect" className="text-slate-600 hover:text-blue-600 transition-colors">论文检测</Link>
              <Link to="/progress" className="text-slate-600 hover:text-blue-600 transition-colors">进度追踪</Link>
              <Link to="/community" className="text-slate-600 hover:text-blue-600 transition-colors">社区</Link>
              <Link to="/profile" className="text-slate-600 hover:text-blue-600 transition-colors">个人中心</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              完全免费 · 无需注册 · 即刻使用
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              精准识别论文中的
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> AI生成内容 </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              学术论文AIGC率检测平台，像追踪语言学习进度一样精准识别论文中的AI生成内容，
              帮助高校、期刊、科研机构提升原创写作能力
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/detect" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                开始免费检测
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/community" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors border border-slate-200">
                了解更多
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">核心功能模块</h2>
            <p className="text-lg text-slate-600">全方位检测分析，助力学术原创</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-xl transition-all ${
                    activeFeature === index
                      ? 'bg-white shadow-lg ring-2 ring-blue-500'
                      : 'bg-white/50 hover:bg-white hover:shadow'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${activeFeature === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${activeFeature === index ? 'rotate-90' : ''}`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Feature Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl ${activeFeature === 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                  {features[activeFeature].icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{features[activeFeature].title}</h3>
                  <p className="text-slate-600">{features[activeFeature].description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {features[activeFeature].details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{detail}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/detect"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                立即体验
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Levels Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">免费检测级别</h2>
            <p className="text-lg text-slate-600">所有功能完全免费使用，无需注册</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {detectionLevels.map((level, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 ${
                  level.popular
                    ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                    : 'border border-slate-200 shadow-sm'
                }`}
              >
                {level.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    推荐使用
                  </div>
                )}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${level.color} text-white mb-6`}>
                  {index === 0 ? <FileText className="w-7 h-7" /> : index === 1 ? <BarChart3 className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{level.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-green-600">免费</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">检测时间：{level.time}</p>
                <ul className="space-y-3 mb-8">
                  {level.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/detect"
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    level.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  立即使用
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">开始您的原创之旅</h2>
            <p className="text-xl text-blue-100 mb-8">完全免费，无需注册，即可体验专业论文AIGC检测</p>
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg"
            >
              立即开始检测
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-white">真写·检测</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/detect" className="hover:text-white transition-colors">论文检测</Link>
              <Link to="/progress" className="hover:text-white transition-colors">进度追踪</Link>
              <Link to="/community" className="hover:text-white transition-colors">社区</Link>
              <Link to="/profile" className="hover:text-white transition-colors">个人中心</Link>
            </div>
            <div className="text-sm">
              © 2024 真写·检测. 保留所有权利
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
