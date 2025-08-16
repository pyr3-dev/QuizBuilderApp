import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import QuizDetail from './pages/QuizDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
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
