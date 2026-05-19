import HeroSection from '../components/home/HeroSection';
import SkillCategories from '../components/home/SkillCategories';
import FeaturedCourses from '../components/home/FeaturedCourses';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <SkillCategories />
      <FeaturedCourses />
    </div>
  );
}