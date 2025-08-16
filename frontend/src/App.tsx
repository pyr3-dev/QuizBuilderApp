import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import QuizDetail from './pages/QuizDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--mux-charcoal)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 mux-gradient opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 mux-gradient-alt opacity-10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-gradient" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)' }}></div>
        </div>
        
        <Navigation />
        <main className="relative z-10 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
