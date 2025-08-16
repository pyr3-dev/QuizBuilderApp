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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Quiz not found'}</div>
        <Link
          to="/quizzes"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-lg text-gray-600">{quiz.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 p-2 rounded-md border border-red-300 hover:bg-red-50"
                title="Delete quiz"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          
          <div className="flex items-center text-sm text-gray-500 space-x-6">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
            </span>
            {quiz.createdAt && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Created {formatDate(quiz.createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions</h2>
          
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div key={question.id || index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{question.text}</p>
                
                {question.type === QuestionType.BOOLEAN && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Answer options:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-gray-700">• True</li>
                      <li className="text-gray-700">• False</li>
                    </ul>
                  </div>
                )}
                
                {question.type === QuestionType.INPUT && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Format: Short text answer</p>
                  </div>
                )}
                
                {question.type === QuestionType.CHECKBOX && question.options && question.options.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">Answer options:</p>
                    <ul className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="text-gray-700">
                          • {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link
            to="/quizzes"
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}