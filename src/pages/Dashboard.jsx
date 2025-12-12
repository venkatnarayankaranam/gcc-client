import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.data.exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusConfig = (status) => {
    const config = {
      upcoming: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-400', 
        border: 'border-yellow-500/30',
        icon: '⏳'
      },
      active: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-400', 
        border: 'border-green-500/30',
        icon: '🟢'
      },
      ended: { 
        bg: 'bg-gray-500/20', 
        text: 'text-gray-400', 
        border: 'border-gray-500/30',
        icon: '⏹️'
      }
    };
    return config[status] || config.upcoming;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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
              to="/results" 
              className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">My Results</span>
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

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold font-heading text-white uppercase tracking-wide">
              Available <span className="text-gold">Exams</span>
            </h2>
            <p className="text-gray-400 mt-2">Select an exam to begin your assessment</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Exams', value: exams.length, icon: '📝' },
              { label: 'Active', value: exams.filter(e => e.status === 'active').length, icon: '🟢' },
              { label: 'Upcoming', value: exams.filter(e => e.status === 'upcoming').length, icon: '⏳' },
              { label: 'Completed', value: exams.filter(e => e.status === 'ended').length, icon: '✅' }
            ].map((stat, idx) => (
              <div key={idx} className="card-premium p-4 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Exams Available</h3>
              <p className="text-gray-400">Check back later for new assessments.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => {
                const statusConfig = getStatusConfig(exam.status);
                return (
                  <div 
                    key={exam._id} 
                    className="card-premium hover:border-gold/40 transition-all duration-300 group fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                        {exam.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        {statusConfig.icon} {exam.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-400">
                        <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(exam.startAt)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div className="flex gap-2">
                          {exam.sections.map((section) => (
                            <span key={section} className="px-2 py-0.5 bg-graysoft rounded text-xs uppercase">
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {exam.status === 'active' && (
                      <Link
                        to={`/exam/${exam._id}`}
                        className="block w-full btn-primary text-center py-3 font-bold uppercase tracking-wider"
                      >
                        Start Exam →
                      </Link>
                    )}
                    {exam.status === 'upcoming' && (
                      <button
                        disabled
                        className="w-full bg-graysoft text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed uppercase tracking-wider"
                      >
                        Not Started Yet
                      </button>
                    )}
                    {exam.status === 'ended' && (
                      <button
                        disabled
                        className="w-full bg-graysoft text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed uppercase tracking-wider"
                      >
                        Exam Ended
                      </button>
                    )}
                  </div>
                );
              })}
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

export default Dashboard;
