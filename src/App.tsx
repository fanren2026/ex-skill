import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LearningHub from './pages/LearningHub';
import LevelPage from './pages/LevelPage';
import ProgressCenter from './pages/ProgressCenter';
import CommunityPage from './pages/CommunityPage';
import RecommendPage from './pages/RecommendPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/learn/:category" element={<LearningHub />} />
            <Route path="/learn/:category/:level" element={<LevelPage />} />
            <Route path="/progress" element={<ProgressCenter />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/recommend" element={<RecommendPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;