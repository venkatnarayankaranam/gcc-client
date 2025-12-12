import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalExams: 0, activeExams: 0, totalSubmissions: 0 });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/admin/exams');
      setExams(response.data.exams);
      
      const now = new Date();
      const activeCount = response.data.exams.filter(e => 
        new Date(e.startAt) <= now && new Date(e.endAt) >= now
      ).length;
      
      setStats({
        totalExams: response.data.exams.length,
        activeExams: activeCount
      });
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      await api.delete(`/admin/exams/${examId}`);
      fetchExams();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete exam');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Premium Admin Navigation */}
      <nav className="nav-premium">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold font-heading">
              <span className="text-gold-gradient">GCC</span>
            </h1>
            <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-black font-bold text-sm">
                👑
              </div>
              <span className="text-white">{user?.name}</span>
            </div>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold font-heading text-white uppercase tracking-wide">
              Admin <span className="text-gold">Dashboard</span>
            </h2>
            <p className="text-gray-400 mt-2">Manage exams, questions, and view results</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="card-premium group hover:shadow-gold-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-2xl">
                  📝
                </div>
                <span className="text-gold text-sm uppercase tracking-wider">Total</span>
              </div>
              <h3 className="text-4xl font-bold text-gold">{stats.totalExams}</h3>
              <p className="text-gray-400 mt-1">Total Exams</p>
            </div>

            <div className="card-premium group hover:shadow-gold-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                  🟢
                </div>
                <span className="text-green-400 text-sm uppercase tracking-wider">Live</span>
              </div>
              <h3 className="text-4xl font-bold text-green-400">{stats.activeExams}</h3>
              <p className="text-gray-400 mt-1">Active Exams</p>
            </div>

            <Link to="/admin/results" className="card-premium group hover:shadow-gold-glow transition-all duration-300 hover:border-gold/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                  📊
                </div>
                <span className="text-purple-400 text-sm uppercase tracking-wider">View</span>
              </div>
              <h3 className="text-xl font-bold text-purple-400 group-hover:text-gold transition-colors">View Results</h3>
              <p className="text-gray-400 mt-1">Student scores & analytics</p>
            </Link>

            <Link to="/admin/exams/create" className="card-premium group hover:shadow-gold-glow transition-all duration-300 hover:border-gold/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">
                  ➕
                </div>
                <span className="text-orange-400 text-sm uppercase tracking-wider">Create</span>
              </div>
              <h3 className="text-xl font-bold text-orange-400 group-hover:text-gold transition-colors">New Exam</h3>
              <p className="text-gray-400 mt-1">Create a new assessment</p>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
              Manage <span className="text-gold">Exams</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/exams/create"
                className="btn-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>+</span> Create Exam
              </Link>
              <Link
                to="/admin/mcqs/add"
                className="btn-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>+</span> Add MCQ
              </Link>
              <Link
                to="/admin/problems/add"
                className="btn-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>+</span> Add Problem
              </Link>
            </div>
          </div>

          {/* Exams Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Exams Created</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first exam.</p>
              <Link to="/admin/exams/create" className="btn-primary px-6 py-3 inline-block">
                Create Your First Exam
              </Link>
            </div>
          ) : (
            <div className="card-premium p-0 overflow-hidden">
              <table className="w-full table-premium">
                <thead>
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left">Start</th>
                    <th className="text-left">End</th>
                    <th className="text-left">Sections</th>
                    <th className="text-center">MCQs</th>
                    <th className="text-center">Problems</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id}>
                      <td className="font-semibold text-white">{exam.title}</td>
                      <td className="text-sm text-gray-400">{formatDate(exam.startAt)}</td>
                      <td className="text-sm text-gray-400">{formatDate(exam.endAt)}</td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          {exam.sections.map((section) => (
                            <span key={section} className="px-2 py-0.5 bg-graysoft text-gold text-xs rounded uppercase">
                              {section}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge-gold">{exam.mcqs?.length || 0}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge-gold">{exam.codingProblems?.length || 0}</span>
                      </td>
                      <td className="text-center">
                        <div className="flex gap-3 justify-center">
                          <Link
                            to={`/admin/exams/${exam._id}`}
                            className="text-gold hover:text-darkgold transition-colors font-medium"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteExam(exam._id)}
                            className="text-red-400 hover:text-red-300 transition-colors font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-6 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 <span className="text-gold">GCC</span> Admin Panel. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
