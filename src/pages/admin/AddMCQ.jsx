import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddMCQ = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    examId: '',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/admin/exams');
      setExams(response.data.exams.filter(e => e.sections.includes('mcq')));
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.examId) {
      setError('Please select an exam');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      setError('All options are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/mcqs', formData);
      setSuccess('MCQ added successfully!');
      setFormData({
        ...formData,
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add MCQ');
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Add <span className="text-gold">MCQ</span>
            </h2>
            <p className="text-gray-400 mt-2 ml-13">Create multiple choice questions for exams</p>
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
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                  Select Exam
                </label>
                <select
                  value={formData.examId}
                  onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                  required
                  className="input-premium"
                >
                  <option value="">Select an exam</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>{exam.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  rows={3}
                  className="input-premium min-h-[100px]"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <label className="block text-gold font-semibold mb-3 uppercase text-sm tracking-wider">
                  Options <span className="text-gray-500 font-normal normal-case">(select correct answer)</span>
                </label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                    <label className="relative cursor-pointer flex items-center justify-center">
                      <input
                        type="radio"
                        name="correctIndex"
                        checked={formData.correctIndex === index}
                        onChange={() => setFormData({ ...formData, correctIndex: index })}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 rounded-full transition-all flex items-center justify-center ${formData.correctIndex === index ? 'border-gold bg-gold' : 'border-gold/50'}`}>
                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${formData.correctIndex === index ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                        className="flex-1 input-premium"
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.correctIndex === index && (
                        <span className="text-green-400 font-semibold text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
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
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add MCQ
                    </span>
                  )}
                </button>
                <Link
                  to="/admin/dashboard"
                  className="flex-1 btn-secondary py-4 text-lg font-bold text-center"
                >
                  Done
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddMCQ;
