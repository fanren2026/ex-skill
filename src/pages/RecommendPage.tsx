import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, TrendingUp, ChevronRight, Clock, Zap, Award, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { skillCategories } from '../data/mockData';
import { formatTime, getLevelLabel, getLevelColor, getDifficultyLabel, getDifficultyColor } from '../utils/helpers';

export default function RecommendPage() {
  const navigate = useNavigate();
  const { progress, weaknesses, setPreferredCategories, setSkillLevel, skillLevel, preferredCategories } = useAppStore();
  const [questions, setQuestions] = useState([
    { id: 1, question: '你的学习目标是什么？', options: ['提升职场竞争力', '掌握新技能', '个人兴趣', '备考认证'] },
    { id: 2, question: '你的当前基础水平？', options: ['零基础', '入门', '进阶', '精通'] },
    { id: 3, question: '你每天能投入多少时间学习？', options: ['30分钟以内', '1小时', '2小时', '3小时以上'] },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateRecommendations();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const generateRecommendations = () => {
    const levelMap: Record<number, string> = { 0: 'basic', 1: 'basic', 2: 'advanced', 3: 'expert' };
    const selectedLevel = levelMap[answers[1]] || 'basic';
    
    setSkillLevel(selectedLevel === 'basic' ? 'beginner' : selectedLevel === 'advanced' ? 'intermediate' : 'advanced');
    
    const categories = skillCategories.flatMap(cat => 
      cat.courses.filter(course => course.level === selectedLevel)
    );
    
    const sortedCourses = categories.sort((a, b) => {
      const aProgress = progress[a.id]?.progress || 0;
      const bProgress = progress[b.id]?.progress || 0;
      return aProgress - bProgress;
    });
    
    setRecommendedCourses(sortedCourses.slice(0, 3));
    setShowRecommendations(true);
  };

  const getLevelBasedOnProgress = () => {
    const completedCount = Object.keys(progress).filter(id => progress[id].progress === 100).length;
    if (completedCount >= 6) return 'expert';
    if (completedCount >= 3) return 'advanced';
    return 'basic';
  };

  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      const autoLevel = getLevelBasedOnProgress();
      const availableCourses = skillCategories.flatMap(cat => 
        cat.courses.filter(course => course.level === autoLevel && (!progress[course.id] || progress[course.id].progress < 100))
      );
      setRecommendedCourses(availableCourses.slice(0, 3));
    }
  }, []);

  if (showRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>智能推荐</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为你推荐的蒸馏课程
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              根据你的学习目标和基础水平，我们为你推荐以下课程
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recommendedCourses.map((course) => {
              const courseProgress = progress[course.id];
              const currentProgress = courseProgress?.progress || 0;
              
              return (
                <div
                  key={course.id}
                  onClick={() => navigate(`/learn/${course.categoryId}/${course.level}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getLevelColor(course.level)}`}>
                      {getLevelLabel(course.level)}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${getDifficultyColor(course.difficulty)} text-xs font-medium`}>
                      {getDifficultyLabel(course.difficulty)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(course.estimatedTime)}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">蒸馏进度</span>
                      <span className="text-sm font-medium text-indigo-600">{currentProgress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {weaknesses.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                需要加强的薄弱环节
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weaknesses.slice(0, 3).map((weakness) => (
                  <div 
                    key={weakness.moduleId} 
                    className="bg-white rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{weakness.topic}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/learn/${weakness.courseId.split('-')[0]}/${weakness.courseId.split('-')[1]}`)}
                      className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      复习
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">继续探索更多课程</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => navigate('/learn/career/basic')}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
              >
                <div className="text-2xl mb-2">💼</div>
                <p className="font-medium">职场核心技能</p>
              </button>
              <button 
                onClick={() => navigate('/learn/general/basic')}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
              >
                <div className="text-2xl mb-2">💡</div>
                <p className="font-medium">通用能力</p>
              </button>
              <button 
                onClick={() => navigate('/learn/technical/basic')}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors"
              >
                <div className="text-2xl mb-2">💻</div>
                <p className="font-medium">专业技术</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
            <Target className="w-4 h-4" />
            <span>智能推荐</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            定制你的学习路径
          </h1>
          <p className="text-gray-600">
            回答几个简单问题，我们将为你推荐最适合的蒸馏课程
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  index === currentQuestion
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110'
                    : index < currentQuestion
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              返回
            </button>
            
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion < questions.length - 1 ? '下一步' : '获取推荐'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            智能推荐算法
          </h3>
          <p className="text-white/80 text-sm">
            我们根据你的学习目标、基础水平和时间投入，结合机器学习算法，为你推荐最适合的学习路径，帮助你高效提升技能。
          </p>
        </div>
      </div>
    </div>
  );
}