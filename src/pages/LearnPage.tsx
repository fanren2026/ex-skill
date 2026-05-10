import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import { useUserStore } from '../stores/userStore';
import { useProgressStore } from '../stores/progressStore';
import { courseService } from '../services/mockServices';
import { BookOpen, PenTool, Mic, Headphones, ArrowLeft, Check, RotateCcw, ChevronRight, Volume2, Star, Zap } from 'lucide-react';
import type { Lesson, VocabularyItem, GrammarItem, SpeakingItem, ListeningItem, Language } from '../types';

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

const levelNames: Record<string, string> = {
  A1: '入门', A2: '初级', B1: '中级', B2: '中高级', C1: '高级', C2: '精通'
};

export default function LearnPage() {
  const { language, level } = useParams<{ language: string; level: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { recordStudy } = useProgressStore();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<string>('vocabulary');
  const [isLearning, setIsLearning] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (language && level) {
      const courseId = `${language}-${level.toLowerCase()}`;
      const courseLessons = courseService.getLessonsByCourse(courseId);
      setLessons(courseLessons);
      if (courseLessons.length > 0 && !currentLesson) {
        setCurrentLesson(courseLessons[0]);
        setActiveModule(courseLessons[0].type);
      }
    }
  }, [language, level]);

  const handleStartLearning = () => {
    setIsLearning(true);
  };

  const handleCompleteLesson = async () => {
    if (currentLesson && user) {
      await recordStudy(user.id, currentLesson.type, currentLesson.duration);
      setXpEarned(prev => prev + currentLesson.xpReward);
      setIsLearning(false);
    }
  };

  const modules = [
    { id: 'vocabulary', icon: BookOpen, label: '单词记忆', color: 'from-blue-500 to-cyan-500' },
    { id: 'grammar', icon: PenTool, label: '语法练习', color: 'from-purple-500 to-pink-500' },
    { id: 'speaking', icon: Mic, label: '口语跟读', color: 'from-orange-500 to-red-500' },
    { id: 'listening', icon: Headphones, label: '听力训练', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">返回</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{languageFlags[language as Language]}</span>
              <div className="text-center">
                <div className="font-semibold text-slate-900">{language?.toUpperCase()} - {level}</div>
                <div className="text-xs text-slate-500">{levelNames[level || 'A1']}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600">{user?.totalXp || 0} XP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLearning ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">选择学习模块</h1>
              <p className="text-slate-500">点击任意模块开始学习</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {modules.map(({ id, icon: Icon, label, color }) => (
                <button
                  key={id}
                  onClick={() => {
                    const lesson = lessons.find(l => l.type === id);
                    if (lesson) {
                      setCurrentLesson(lesson);
                      setActiveModule(id);
                    }
                  }}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{label}</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {id === 'vocabulary' && '艾宾浩斯记忆曲线'}
                    {id === 'grammar' && '互动式语法练习'}
                    {id === 'speaking' && 'AI 发音评分'}
                    {id === 'listening' && '沉浸式听力场景'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{lessons.find(l => l.type === id)?.duration || 0} 分钟</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{currentLesson?.title || '选择课程开始学习'}</h2>
                  <p className="text-slate-500">
                    {currentLesson ? `${modules.find(m => m.id === activeModule)?.label} - ${currentLesson.duration}分钟` : '选择一个学习模块开始'}
                  </p>
                </div>
                {currentLesson && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-700">+{currentLesson.xpReward} XP</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleStartLearning}
                disabled={!currentLesson}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {currentLesson ? '开始学习' : '请先选择学习模块'}
              </button>
            </div>

            {xpEarned > 0 && (
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl z-50 animate-bounce">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">太棒了！</h3>
                  <p className="text-slate-600 mb-4">你获得了 <span className="text-amber-600 font-bold">{xpEarned} XP</span></p>
                  <button onClick={() => setXpEarned(0)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    继续学习
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <LearningInterface
            lesson={currentLesson!}
            activeModule={activeModule}
            onComplete={handleCompleteLesson}
            onBack={() => setIsLearning(false)}
          />
        )}
      </main>
    </div>
  );
}

interface LearningInterfaceProps {
  lesson: Lesson;
  activeModule: string;
  onComplete: () => void;
  onBack: () => void;
}

function LearningInterface({ lesson, activeModule, onComplete, onBack }: LearningInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'vocabulary':
        return <VocabularyModule content={lesson.content as VocabularyItem[]} currentIndex={currentIndex} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />;
      case 'grammar':
        return <GrammarModule content={lesson.content as GrammarItem[]} currentIndex={currentIndex} answers={answers} setAnswers={setAnswers} />;
      case 'speaking':
        return <SpeakingModule content={lesson.content as SpeakingItem[]} currentIndex={currentIndex} isRecording={isRecording} setIsRecording={setIsRecording} />;
      case 'listening':
        return <ListeningModule content={lesson.content as ListeningItem[]} currentIndex={currentIndex} />;
      default:
        return null;
    }
  };

  const contentLength = (lesson.content as any[])?.length || 4;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          退出学习
        </button>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: contentLength }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">{currentIndex + 1} / {contentLength}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {renderModuleContent()}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一个
        </button>
        {currentIndex < contentLength - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            下一个
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
          >
            完成学习
          </button>
        )}
      </div>
    </div>
  );
}

function VocabularyModule({ content, currentIndex, isFlipped, onFlip }: { content: VocabularyItem[]; currentIndex: number; isFlipped: boolean; onFlip: () => void }) {
  const item = content[currentIndex];
  if (!item) return null;

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <span className="text-sm text-slate-400">点击卡片翻转</span>
      </div>
      <div
        onClick={onFlip}
        className="relative w-full h-80 cursor-pointer perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <div className={`absolute inset-0 transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center p-8" style={{ backfaceVisibility: 'hidden' }}>
            <span className="text-4xl font-bold text-white mb-2">{item.word}</span>
            <span className="text-indigo-200">{item.pronunciation}</span>
            <span className="text-indigo-300 text-sm mt-4">点击查看释义</span>
          </div>
          <div className="absolute inset-0 bg-white border-2 border-indigo-200 rounded-2xl flex flex-col items-center justify-center p-8" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <span className="text-4xl font-bold text-slate-900 mb-4">{item.translation}</span>
            <div className="bg-slate-50 rounded-xl p-4 w-full">
              <p className="text-slate-600 mb-2">{item.example}</p>
              <p className="text-slate-400 text-sm">{item.exampleTranslation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrammarModule({ content, currentIndex, answers, setAnswers }: { content: GrammarItem[]; currentIndex: number; answers: Record<string, string>; setAnswers: (a: Record<string, string>) => void }) {
  const item = content[currentIndex];
  if (!item) return null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
          语法规则
        </span>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.rule}</h3>
        <p className="text-slate-600">{item.explanation}</p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-700">例句：</h4>
        {item.examples.map((example, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-800 font-medium mb-1">{example.original}</p>
            <p className="text-slate-500 text-sm">{example.translated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeakingModule({ content, currentIndex, isRecording, setIsRecording }: { content: SpeakingItem[]; currentIndex: number; isRecording: boolean; setIsRecording: (v: boolean) => void }) {
  const item = content[currentIndex];
  if (!item) return null;

  return (
    <div className="p-8">
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
          口语跟读
        </span>
        <p className="text-2xl font-bold text-slate-900 mb-2">{item.prompt}</p>
        <p className="text-slate-500 mb-8">{item.translation}</p>
        
        <div className={`w-32 h-32 mx-auto rounded-full border-4 ${isRecording ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-200 bg-slate-50'} flex items-center justify-center mb-6 transition-all`}>
          <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-slate-400'}`} />
        </div>
        
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-8 py-3 font-semibold rounded-xl transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          {isRecording ? '停止录音' : '开始录音'}
        </button>
        
        {isRecording && (
          <div className="mt-6 flex justify-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListeningModule({ content, currentIndex }: { content: ListeningItem[]; currentIndex: number }) {
  const item = content[currentIndex];
  if (!item) return null;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
          听力训练
        </span>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
        
        <button className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all mb-6">
          <Volume2 className="w-8 h-8 text-white" />
        </button>
        
        <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-slate-700 leading-relaxed">{item.transcript}</p>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-xl max-w-md mx-auto">
          <p className="text-green-700 text-sm">参考译文</p>
          <p className="text-green-600">{item.translation}</p>
        </div>
      </div>
    </div>
  );
}
