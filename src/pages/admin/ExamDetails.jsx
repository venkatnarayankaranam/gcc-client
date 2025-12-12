import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const ExamDetails = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const response = await api.get(`/admin/exams/${id}`);
      setExam(response.data.exam);
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMCQ = async (mcqId) => {
    if (!confirm('Are you sure you want to delete this MCQ?')) return;
    
    try {
      await api.delete(`/admin/mcqs/${mcqId}`);
      fetchExam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete MCQ');
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await api.delete(`/admin/problems/${problemId}`);
      fetchExam();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete problem');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="card-premium p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-xl">Exam not found</p>
          <Link to="/admin/dashboard" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-gold uppercase tracking-wide">
              {exam.title}
            </h2>
          </div>

          {/* Exam Info Card */}
          <div className="card-premium p-6 mb-6">
            <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Exam Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Start Time</p>
                <p className="text-white font-semibold">{new Date(exam.startAt).toLocaleString()}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">End Time</p>
                <p className="text-white font-semibold">{new Date(exam.endAt).toLocaleString()}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Duration</p>
                <p className="text-gold font-bold text-xl">{exam.duration} <span className="text-sm font-normal text-gray-400">min</span></p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Sections</p>
                <div className="flex gap-2 mt-1">
                  {exam.sections.map(section => (
                    <span key={section} className="bg-gold/20 text-gold px-2 py-1 rounded text-sm font-semibold uppercase">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MCQs Section */}
          {exam.sections.includes('mcq') && (
            <div className="card-premium p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  MCQs 
                  <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-sm ml-2">
                    {exam.mcqs?.length || 0}
                  </span>
                </h3>
                <Link
                  to="/admin/mcqs/add"
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add MCQ
                </Link>
              </div>
              
              {exam.mcqs?.length > 0 ? (
                <div className="space-y-4">
                  {exam.mcqs.map((mcq, index) => (
                    <div key={mcq._id} className="bg-black/30 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            <span className="text-gold mr-2">Q{index + 1}.</span>
                            {mcq.question}
                          </p>
                          <div className="mt-3 space-y-2">
                            {mcq.options.map((opt, idx) => (
                              <p key={idx} className={`text-sm flex items-center gap-2 ${idx === mcq.correctIndex ? 'text-green-400' : 'text-gray-400'}`}>
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${idx === mcq.correctIndex ? 'border-green-400 bg-green-400/20' : 'border-gray-600'}`}>
                                  {idx === mcq.correctIndex && '✓'}
                                </span>
                                {opt}
                              </p>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMCQ(mcq._id)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No MCQs added yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Coding Problems Section */}
          {exam.sections.includes('coding') && (
            <div className="card-premium p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Coding Problems
                  <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-sm ml-2">
                    {exam.codingProblems?.length || 0}
                  </span>
                </h3>
                <Link
                  to="/admin/problems/add"
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Problem
                </Link>
              </div>
              
              {exam.codingProblems?.length > 0 ? (
                <div className="space-y-4">
                  {exam.codingProblems.map((problem, index) => (
                    <div key={problem._id} className="bg-black/30 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg">
                            <span className="text-gold mr-2">#{index + 1}</span>
                            {problem.title}
                          </p>
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{problem.statement}</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {problem.timeLimitMs}ms
                            </span>
                            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                              {problem.memoryLimitMb}MB
                            </span>
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                              {problem.samples?.length || 0} samples
                            </span>
                            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-sm">
                              {problem.hiddenTestcases?.length || 0} hidden tests
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProblem(problem._id)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No coding problems added yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamDetails;
