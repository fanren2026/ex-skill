import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, Award } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: '高效蒸馏', desc: '摒弃冗余知识，聚焦核心能力' },
    { icon: Target, title: '精准定位', desc: '个性化学习路径推荐' },
    { icon: Award, title: '成就激励', desc: '完成目标获取勋章' },
  ];

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>无需注册，即刻开始</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              技能蒸馏
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                高效赋能
              </span>
            </h1>
            
            <p className="text-lg text-white/80 mb-8 max-w-xl">
              专注技能蒸馏赋能的在线学习平台，摒弃冗余知识，聚焦核心能力沉淀，为您提供高效化的skill蒸馏体验。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/learn')}
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                开始蒸馏
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/recommend')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                智能推荐
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20" />
              
              <div className="absolute inset-8 flex flex-col justify-center items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-pulse">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
                      >
                        <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white font-medium text-sm">{feature.title}</p>
                        <p className="text-white/60 text-xs">{feature.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-12 grid grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-medium text-sm">{feature.title}</p>
                <p className="text-white/60 text-xs">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}