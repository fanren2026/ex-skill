import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ChevronRight, Clock, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { skillCategories } from '../data/mockData';
import { formatTime, getDifficultyColor, getDifficultyLabel, getLevelLabel, getLevelColor } from '../utils/helpers';
export default function LearningHub() {
 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 const navigate = useNavigate();
 const { progress } = useAppStore();
 const levelIcons = {
 basic: '🌱',
 advanced: '🚀',
 expert: '🌟'
 };
 return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-12">
 <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
 <BookOpen className="w-4 h-4"/>
 <span>学习中心</span>
 </div>
 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
 分层蒸馏体系
 </h1>
 <p className="text-gray-600 max-w-2xl mx-auto">
 选择适合你的蒸馏等级，从基础入门到高阶精通，循序渐进提升技能
 </p>
 </div>

 {!selectedCategory ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
 {skillCategories.map((category) => (<div key={category.id} onClick={() => setSelectedCategory(category.id)} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group">
 <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${category.color}20` }}>
 <Sparkles className="w-10 h-10" style={{ color: category.color }}/>
 </div>
 
 <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
 {category.name}
 </h3>
 
 <p className="text-gray-600 text-center mb-6">
 {category.description}
 </p>
 
 <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
 <span>选择这个分类</span>
 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
 </div>
 </div>))}
 </div>) : (<div className="mb-8">
 <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6">
 <ChevronRight className="w-5 h-5 rotate-180"/>
 <span>返回分类选择</span>
 </button>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {skillCategories.find(c => c.id === selectedCategory)?.courses.map((course) => {
 const courseProgress = progress[course.id];
 const currentProgress = courseProgress?.progress || 0;
 return (<div key={course.id} onClick={() => navigate(`/learn/${course.categoryId}/${course.level}`)} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
 <div className="flex items-center justify-between mb-4">
 <span className="text-3xl">{levelIcons[course.level]}</span>
 <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getLevelColor(course.level)}`}>
 {getLevelLabel(course.level)}
 </span>
 </div>
 
 <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
 {course.name}
 </h3>
 
 <p className="text-gray-600 mb-6">
 {course.description}
 </p>
 
 <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
 <span className="flex items-center gap-1">
 <Clock className="w-4 h-4"/>
 {formatTime(course.estimatedTime)}
 </span>
 <span className={`px-2 py-0.5 rounded ${getDifficultyColor(course.difficulty)} text-xs font-medium`}>
 {getDifficultyLabel(course.difficulty)}
 </span>
 </div>
 
 <div className="relative">
 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
 <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${currentProgress}%` }}/>
 </div>
 <div className="flex items-center justify-between mt-3">
 <span className="text-sm text-gray-500 flex items-center gap-1">
 <BarChart3 className="w-4 h-4"/>
 已完成 {currentProgress}%
 </span>
 <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"/>
 </div>
 </div>
 </div>);
 })}
 </div>
 </div>)}

 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mt-12">
 <h3 className="text-xl font-bold mb-4">蒸馏学习方法</h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="text-2xl mb-2">📚</div>
 <h4 className="font-semibold mb-1">核心知识提炼</h4>
 <p className="text-white/70 text-sm">聚焦核心概念，摒弃冗余信息</p>
 </div>
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="text-2xl mb-2">💡</div>
 <h4 className="font-semibold mb-1">实操案例拆解</h4>
 <p className="text-white/70 text-sm">真实场景分析，深入理解应用</p>
 </div>
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="text-2xl mb-2">🔍</div>
 <h4 className="font-semibold mb-1">错题复盘蒸馏</h4>
 <p className="text-white/70 text-sm">分析错误原因，巩固薄弱环节</p>
 </div>
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="text-2xl mb-2">🎯</div>
 <h4 className="font-semibold mb-1">技能应用演练</h4>
 <p className="text-white/70 text-sm">实战练习巩固，提升应用能力</p>
 </div>
 </div>
 </div>
 </div>
 </div>);
}

