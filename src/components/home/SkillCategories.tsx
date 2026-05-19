import { useNavigate } from 'react-router-dom';
import { Briefcase, Lightbulb, Code, ArrowRight } from 'lucide-react';
import { skillCategories } from '../../data/mockData';

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Lightbulb,
  Code,
};

export default function SkillCategories() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            技能蒸馏分类
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            涵盖职场核心技能、通用能力、专业技术等主流skill领域，选择适合你的蒸馏方向
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => {
            const Icon = iconMap[category.icon] || Briefcase;
            const courseCount = category.courses.length;
            
            return (
              <div
                key={category.id}
                onClick={() => navigate(`/learn/${category.id}`)}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: category.color }} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {courseCount} 个蒸馏课程
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}