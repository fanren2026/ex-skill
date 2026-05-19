import { useNavigate } from 'react-router-dom';
import { Clock, BarChart3, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { skillCategories } from '../../data/mockData';
import { formatTime, getDifficultyColor, getDifficultyLabel, getLevelLabel, getLevelColor } from '../../utils/helpers';

export default function FeaturedCourses() {
  const navigate = useNavigate();
  const { progress } = useAppStore();

  const allCourses = skillCategories.flatMap(category => category.courses);
  const featuredCourses = allCourses.slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              精选蒸馏课程
            </h2>
            <p className="text-gray-600">
              从基础到精通，循序渐进的技能蒸馏之旅
            </p>
          </div>
          <button
            onClick={() => navigate('/learn')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            查看全部
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => {
            const courseProgress = progress[course.id];
            const currentProgress = courseProgress?.progress || 0;
            
            return (
              <div
                key={course.id}
                onClick={() => navigate(`/learn/${course.categoryId}/${course.level}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mb-4 bg-gradient-to-r ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.name}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(course.estimatedTime)}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${getDifficultyColor(course.difficulty)} text-xs font-medium`}>
                    {getDifficultyLabel(course.difficulty)}
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
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      蒸馏进度
                    </span>
                    <span className="text-xs font-medium text-indigo-600">
                      {currentProgress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <button
            onClick={() => navigate('/learn')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            查看全部课程
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}