import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Circular Progress Component
const CircularProgress = ({ value, max, label, color = 'gold' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorMap = {
    gold: { stroke: '#F4C542', bg: 'rgba(244, 197, 66, 0.2)' },
    green: { stroke: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
    purple: { stroke: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.2)' }
  };
  
  const colors = colorMap[color] || colorMap.gold;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={colors.bg}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={colors.stroke}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <p className="text-gray-400 mt-2 text-sm uppercase tracking-wider">{label}</p>
    </div>
  );
};

const Results = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/exams/results');
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (result) => {
    if (result.tabSwitch) {
      return (
        <span className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold border border-red-500/30 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          Auto Submitted
        </span>
      );
    }
    if (result.status === 'submitted') {
      return (
        <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Submitted
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
        In Progress
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Premium Navigation */}
      <nav className="nav-premium">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold font-heading">
              <span className="text-gold-gradient">GCC</span>
            </h1>
            <span className="hidden sm:block text-gray-500 text-sm uppercase tracking-widest">Platform</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-black font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white">{user?.name}</span>
            </div>
            <Link 
              to="/dashboard" 
              className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold font-heading text-white uppercase tracking-wide">
              My <span className="text-gold">Results</span>
            </h2>
            <p className="text-gray-400 mt-2">View your exam performance and scores</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Results Yet</h3>
              <p className="text-gray-400 mb-6">Complete an exam to see your results here.</p>
              <Link to="/dashboard" className="btn-primary px-6 py-3 inline-block">
                Take an Exam
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div 
                  key={result._id} 
                  className="card-premium p-8 fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gold mb-2">
                        {result.examId?.title || 'Exam'}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(result.submittedAt || result.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(result)}
                  </div>

                  {/* Score Circles */}
                  <div className="flex justify-around items-center py-6 border-y border-gold/10">
                    <CircularProgress 
                      value={result.mcqScore} 
                      max={10} 
                      label="MCQ Score" 
                      color="gold"
                    />
                    <CircularProgress 
                      value={result.codingScore} 
                      max={10} 
                      label="Coding Score" 
                      color="green"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-glow">
                        <div className="w-28 h-28 rounded-full bg-charcoal flex items-center justify-center">
                          <span className="text-4xl font-extrabold text-gold">{result.totalScore}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mt-3 text-sm uppercase tracking-wider">Total Score</p>
                    </div>
                  </div>

                  {/* Tab Switch Warning */}
                  {result.tabSwitch && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                          ⚠️
                        </div>
                        <div>
                          <p className="text-red-400 font-bold text-lg uppercase tracking-wider">
                            Tab Switch Detected
                          </p>
                          <p className="text-red-300/80 text-sm mt-1">
                            Your exam was auto-submitted due to switching tabs or windows.
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            Reason: {result.terminationReason || 'Tab Switch Detected'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-6 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 <span className="text-gold">GCC</span> Hiring Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Results;
