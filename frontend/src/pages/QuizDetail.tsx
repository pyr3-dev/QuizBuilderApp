import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { QuestionType, type Quiz } from '../types/quiz';

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id]);

  const fetchQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const data = await api.getQuiz(quizId);
      setQuiz(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch quiz details');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await api.deleteQuiz(id);
      navigate('/quizzes');
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.BOOLEAN:
        return 'True/False';
      case QuestionType.INPUT:
        return 'Short Answer';
      case QuestionType.CHECKBOX:
        return 'Multiple Choice';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-mux-putty rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-mux-orange rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-400 font-mono text-sm">Loading quiz details...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-12 animate-slide-up">
        <div className="glass-card p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-red-400 mb-6 font-medium">{error || 'Quiz not found'}</div>
          <Link
            to="/quizzes"
            className="bg-mux-gradient text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-200 font-medium neon-glow"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card">
        <div className="p-8 border-b border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-3">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-xl text-gray-300 leading-relaxed">{quiz.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-400 p-3 rounded-lg border border-white/10 hover:bg-red-500/10 transition-all duration-200"
                title="Delete quiz"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-sm space-x-6">
            <span className="flex items-center space-x-2 bg-mux-putty px-4 py-2 rounded-full">
              <svg className="w-5 h-5 text-mux-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-300 font-mono font-medium">
                {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
              </span>
            </span>
            {quiz.createdAt && (
              <span className="flex items-center space-x-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-mono">Created {formatDate(quiz.createdAt)}</span>
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
            <div className="w-8 h-8 bg-mux-gradient rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Questions</span>
          </h2>
          
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div key={question.id || index} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-mux-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Question {index + 1}
                    </h3>
                  </div>
                  <span className="bg-mux-putty text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">{question.text}</p>
                
                {question.type === QuestionType.BOOLEAN && (
                  <div className="bg-mux-charcoal/50 p-4 rounded-lg border border-white/5">
                    <p className="text-sm text-gray-400 mb-3 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-mux-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Answer options:</span>
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">True</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-300">False</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {question.type === QuestionType.INPUT && (
                  <div className="bg-mux-charcoal/50 p-4 rounded-lg border border-white/5">
                    <p className="text-sm text-gray-400 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-mux-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Format: Short text answer</span>
                    </p>
                  </div>
                )}
                
                {question.type === QuestionType.CHECKBOX && question.options && question.options.length > 0 && (
                  <div className="bg-mux-charcoal/50 p-4 rounded-lg border border-white/5">
                    <p className="text-sm text-gray-400 mb-3 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-mux-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Answer options:</span>
                    </p>
                    <ul className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-mux-pink rounded-full"></div>
                          <span className="text-gray-300">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-8 py-6 border-t border-white/10 bg-mux-charcoal/20">
          <Link
            to="/quizzes"
            className="bg-mux-gradient text-white px-8 py-3 rounded-lg hover:scale-105 focus:outline-none transition-all duration-200 font-medium neon-glow inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Quizzes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}