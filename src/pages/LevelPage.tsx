import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, BookOpen, Lightbulb, AlertTriangle, Target, Clock, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getCourseById } from '../data/mockData';
import { formatTime, getModuleTypeLabel, getModuleTypeColor } from '../utils/helpers';

function QuizQuestionCard({ question, answers, onAnswer, showResults }: {
  question: any;
  answers: Record<string, number>;
  onAnswer: (id: string, index: number) => void;
  showResults: boolean;
}) {
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctAnswer;

  if (showResults) {
    return (
      <div key={question.id} className={`rounded-xl p-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-medium text-gray-900">{question.question}</p>
            <div className="mt-2 space-y-2">
              {question.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg ${
                    index === question.correctAnswer
                      ? 'bg-green-200 text-green-800'
                      : userAnswer === index
                      ? 'bg-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              <strong>解析：</strong>{question.explanation}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={question.id} className="bg-gray-50 rounded-xl p-6">
      <p className="font-medium text-gray-900 mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, index)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
              userAnswer === index
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LevelPage() {
  const { category, level } = useParams<{
    category: string;
    level: string;
  }>();
  const navigate = useNavigate();
  const { progress, setProgress, earnBadge, weaknesses, addWeakness } = useAppStore();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const course = getCourseById(`${category}-${level}`);
  const modules = course?.modules || [];
  const currentModule = modules[currentModuleIndex];
  const courseProgress = progress[course?.id || ''];
  const completedModules = courseProgress?.completedModules || [];

  useEffect(() => {
    if (!category || !level) {
      navigate('/learn');
    }
  }, [category, level, navigate]);

  useEffect(() => {
    setShowResults(false);
    setAnswers({});
    setScore(0);
  }, [currentModuleIndex]);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentModule?.questions) return;

    let correctCount = 0;
    currentModule.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      } else {
        addWeakness({
          courseId: course?.id || '',
          moduleId: currentModule.id,
          topic: currentModule.title,
          confidence: 0
        });
      }
    });

    const currentScore = Math.round((correctCount / currentModule.questions.length) * 100);
    setScore(currentScore);
    setShowResults(true);

    if (currentScore === 100) {
      earnBadge('perfect-score');
    }

    const newCompletedModules = [...completedModules, currentModule.id];
    const newProgress = Math.round((newCompletedModules.length / modules.length) * 100);
    setProgress(course?.id || '', newProgress, newCompletedModules);

    if (newProgress === 100) {
      earnBadge('first-step');
      const totalCompleted = Object.keys(progress).filter(id => progress[id].progress === 100).length;
      if (totalCompleted >= 3) {
        earnBadge('knowledge-seeker');
      }
      if (totalCompleted >= 9) {
        earnBadge('distillation-master');
      }
    }
  };

  const handleNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">课程不存在</p>
      </div>
    );
  }

  const moduleTypeIcons: Record<string, typeof BookOpen> = {
    knowledge: BookOpen,
    case: Lightbulb,
    error: AlertTriangle,
    practice: Target
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回学习中心</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {formatTime(course.estimatedTime)}
            </span>
            {showResults && score >= 80 && (
              <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                {score}分
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{course.name}</h1>
            <p className="text-white/80">{course.description}</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {modules.map((module: any, index: number) => {
                  const Icon = moduleTypeIcons[module.type] || BookOpen;
                  const isCompleted = completedModules.includes(module.id);
                  const isCurrent = index === currentModuleIndex;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleIndex(index)}
                      disabled={!isCompleted && index < currentModuleIndex}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{getModuleTypeLabel(module.type)}</span>
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative h-2 bg-gray-100 rounded-full mb-6">
              <div
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentModuleIndex + 1) / modules.length) * 100}%` }}
              />
            </div>

            {currentModule && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getModuleTypeColor(currentModule.type)}`}
                  >
                    {(() => {
                      const Icon = moduleTypeIcons[currentModule.type];
                      return Icon ? <Icon className="w-6 h-6 text-white" /> : null;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{currentModule.title}</h2>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium text-white ${getModuleTypeColor(currentModule.type)}`}
                    >
                      {getModuleTypeLabel(currentModule.type)}
                    </span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{currentModule.content}</p>
                </div>

                {currentModule.type === 'practice' && currentModule.questions && (
                  <div className="space-y-4">
                    {currentModule.questions.map((question: any) => (
                      <QuizQuestionCard
                        key={question.id}
                        question={question}
                        answers={answers}
                        onAnswer={handleAnswer}
                        showResults={showResults}
                      />
                    ))}

                    {!showResults && (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(answers).length < currentModule.questions.length}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        提交答案
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevModule}
                disabled={currentModuleIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                上一个
              </button>

              <span className="text-gray-500">
                {currentModuleIndex + 1} / {modules.length}
              </span>

              {currentModuleIndex < modules.length - 1 ? (
                <button
                  onClick={handleNextModule}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  下一个
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : completedModules.length === modules.length ? (
                <button
                  onClick={() => navigate('/progress')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  查看蒸馏进度
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <div className="text-gray-400">
                  请完成当前模块后继续
                </div>
              )}
            </div>
          </div>
        </div>

        {weaknesses.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8">
            <h3 className="font-bold text-amber-800 mb-4">薄弱环节提醒</h3>
            <div className="space-y-2">
              {weaknesses.slice(0, 3).map((weakness) => (
                <div
                  key={weakness.moduleId}
                  className="flex items-center justify-between bg-amber-100 rounded-lg px-4 py-2"
                >
                  <span className="text-amber-800">{weakness.topic}</span>
                  <button
                    onClick={() => navigate(`/learn/${category}/${level}`)}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    复习
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
