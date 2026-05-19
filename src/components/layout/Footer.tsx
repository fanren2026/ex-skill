import { Sparkles, Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">SkillDistill</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              专注技能蒸馏赋能的在线学习平台，摒弃冗余知识，聚焦核心能力沉淀，为您提供高效化的skill蒸馏体验。
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">学习资源</h3>
            <ul className="space-y-2">
              <li>
                <a href="/learn" className="text-gray-400 hover:text-white transition-colors">学习中心</a>
              </li>
              <li>
                <a href="/recommend" className="text-gray-400 hover:text-white transition-colors">智能推荐</a>
              </li>
              <li>
                <a href="/progress" className="text-gray-400 hover:text-white transition-colors">进度追踪</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">社区</h3>
            <ul className="space-y-2">
              <li>
                <a href="/community" className="text-gray-400 hover:text-white transition-colors">讨论区</a>
              </li>
              <li>
                <a href="/community#achievements" className="text-gray-400 hover:text-white transition-colors">成就系统</a>
              </li>
              <li>
                <a href="/community#share" className="text-gray-400 hover:text-white transition-colors">经验分享</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 SkillDistill. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> by SkillDistill Team
          </p>
        </div>
      </div>
    </footer>
  );
}