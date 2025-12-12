import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateExam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    startAt: '',
    endAt: '',
    duration: 60,
    sections: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSectionChange = (section) => {
    const sections = formData.sections.includes(section)
      ? formData.sections.filter(s => s !== section)
      : [...formData.sections, section];
    setFormData({ ...formData, sections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.sections.length === 0) {
      setError('Please select at least one section');
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/exams', formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Premium Admin Nav */}
      <nav className="nav-premium">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold font-heading">
                <span className="text-gold-gradient">GCC</span>
              </h1>
              <span className="text-gray-500 text-sm uppercase tracking-widest">Admin</span>
            </Link>
          </div>
          <Link 
            to="/admin/dashboard" 
            className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-white uppercase tracking-wide flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Create <span className="text-gold">Exam</span>
            </h2>
            <p className="text-gray-400 mt-2 ml-13">Set up a new examination for candidates</p>
          </div>

          <div className="card-premium p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                  Exam Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="e.g., Programming Assessment 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    required
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    required
                    className="input-premium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-gold font-semibold mb-3 uppercase text-sm tracking-wider">
                  Exam Sections
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.sections.includes('mcq')}
                        onChange={() => handleSectionChange('mcq')}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 border-2 border-gold/50 rounded-md peer-checked:bg-gold peer-checked:border-gold transition-all">
                        <svg className="w-4 h-4 text-black absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300 group-hover:text-gold transition-colors">MCQ Section</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.sections.includes('coding')}
                        onChange={() => handleSectionChange('coding')}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 border-2 border-gold/50 rounded-md peer-checked:bg-gold peer-checked:border-gold transition-all">
                        <svg className="w-4 h-4 text-black absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-300 group-hover:text-gold transition-colors">Coding Section</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary py-4 text-lg font-bold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Exam'}
                </button>
                <Link
                  to="/admin/dashboard"
                  className="flex-1 btn-secondary py-4 text-lg font-bold text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateExam;
