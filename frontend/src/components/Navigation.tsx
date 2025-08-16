import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="w-8 h-8 bg-mux-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text tracking-tight">
                Quiz Builder
              </span>
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link
                to="/quizzes"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') || isActive('/quizzes')
                    ? 'bg-mux-gradient text-white shadow-lg neon-glow'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                All Quizzes
              </Link>
              <Link
                to="/create"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/create')
                    ? 'bg-mux-gradient text-white shadow-lg neon-glow'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Create Quiz
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Link
              to="/create"
              className="bg-mux-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200 neon-glow"
            >
              Create Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}