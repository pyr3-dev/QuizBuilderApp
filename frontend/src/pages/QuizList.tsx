import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { QuizListItem } from '../types/quiz';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await api.getQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch quizzes');
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await api.deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--mux-putty)' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'var(--mux-orange)' }}></div>
        </div>
        <p className="mt-4 text-gray-400 font-mono text-sm">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-slide-up">
        <div className="glass-card p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-red-400 mb-6 font-medium">{error}</div>
          <button
            onClick={fetchQuizzes}
            className="mux-gradient text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-200 font-medium neon-glow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Quiz Library
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and manage your collection of interactive quizzes
          </p>
        </div>
        <Link
          to="/create"
          className="group mux-gradient text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-200 font-semibold neon-glow flex items-center space-x-2 w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Quiz</span>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-20 animate-slide-up">
          <div className="glass-card p-12 max-w-lg mx-auto">
            <div className="w-24 h-24 mux-gradient opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No quizzes yet</h3>
            <p className="text-gray-400 mb-8">Start building your first interactive quiz and share it with the world.</p>
            <Link
              to="/create"
              className="mux-gradient text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-200 font-medium neon-glow inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Your First Quiz</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className={`glass-card p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white line-clamp-2 group-hover:gradient-text transition-all duration-300">
                  {quiz.title}
                </h2>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-md hover:bg-red-500/10"
                  title="Delete quiz"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {quiz.description && (
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {quiz.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <span className="flex items-center space-x-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--mux-putty)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--mux-orange)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300 font-mono">
                    {quiz._count.questions} question{quiz._count.questions !== 1 ? 's' : ''}
                  </span>
                </span>
                <span className="text-gray-500 font-mono text-xs">
                  {formatDate(quiz.createdAt)}
                </span>
              </div>
              
              <Link
                to={`/quizzes/${quiz.id}`}
                className="group block w-full text-center bg-white/5 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium border border-white/10 hover:border-transparent hover:neon-glow"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--mux-orange) 0%, var(--mux-pink) 50%, var(--mux-purple) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}