import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AddProblem = () => {
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    examId: '',
    title: '',
    statement: '',
    samples: [{ input: '', output: '' }],
    hiddenTestcases: [{ input: '', expected: '' }],
    timeLimitMs: 2000,
    memoryLimitMb: 256
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
      setExams(response.data.exams.filter(e => e.sections.includes('coding')));
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSampleChange = (index, field, value) => {
    const newSamples = [...formData.samples];
    newSamples[index][field] = value;
    setFormData({ ...formData, samples: newSamples });
  };

  const addSample = () => {
    setFormData({
      ...formData,
      samples: [...formData.samples, { input: '', output: '' }]
    });
  };

  const removeSample = (index) => {
    if (formData.samples.length > 1) {
      const newSamples = formData.samples.filter((_, i) => i !== index);
      setFormData({ ...formData, samples: newSamples });
    }
  };

  const handleTestcaseChange = (index, field, value) => {
    const newTestcases = [...formData.hiddenTestcases];
    newTestcases[index][field] = value;
    setFormData({ ...formData, hiddenTestcases: newTestcases });
  };

  const addTestcase = () => {
    setFormData({
      ...formData,
      hiddenTestcases: [...formData.hiddenTestcases, { input: '', expected: '' }]
    });
  };

  const removeTestcase = (index) => {
    if (formData.hiddenTestcases.length > 1) {
      const newTestcases = formData.hiddenTestcases.filter((_, i) => i !== index);
      setFormData({ ...formData, hiddenTestcases: newTestcases });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.examId) {
      setError('Please select an exam');
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/problems', formData);
      setSuccess('Coding problem added successfully!');
      setFormData({
        ...formData,
        title: '',
        statement: '',
        samples: [{ input: '', output: '' }],
        hiddenTestcases: [{ input: '', expected: '' }]
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add problem');
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-white uppercase tracking-wide flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              Add <span className="text-gold">Coding Problem</span>
            </h2>
            <p className="text-gray-400 mt-2 ml-13">Create coding challenges for candidates</p>
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
              <div className="grid grid-cols-2 gap-6">
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
                    Problem Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-premium"
                    placeholder="e.g., Two Sum"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                  Problem Statement
                </label>
                <textarea
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  required
                  rows={6}
                  className="input-premium min-h-[150px]"
                  placeholder="Describe the problem in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                    Time Limit (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimitMs}
                    onChange={(e) => setFormData({ ...formData, timeLimitMs: parseInt(e.target.value) })}
                    required
                    min="100"
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="block text-gold font-semibold mb-2 uppercase text-sm tracking-wider">
                    Memory Limit (MB)
                  </label>
                  <input
                    type="number"
                    value={formData.memoryLimitMb}
                    onChange={(e) => setFormData({ ...formData, memoryLimitMb: parseInt(e.target.value) })}
                    required
                    min="16"
                    className="input-premium"
                  />
                </div>
              </div>

              {/* Sample Test Cases */}
              <div className="border border-gold/20 rounded-xl p-6 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gold font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Sample Test Cases
                    <span className="text-gray-500 font-normal normal-case">(Visible to users)</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSample}
                    className="text-gold hover:text-gold-dark transition-colors text-sm font-semibold flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Sample
                  </button>
                </div>
                {formData.samples.map((sample, index) => (
                  <div key={index} className="border border-gold/10 rounded-xl p-4 mb-3 bg-charcoal">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-semibold">Sample {index + 1}</span>
                      {formData.samples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSample(index)}
                          className="text-red-400 hover:text-red-300 transition-colors text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Input</label>
                        <textarea
                          value={sample.input}
                          onChange={(e) => handleSampleChange(index, 'input', e.target.value)}
                          rows={3}
                          className="input-premium text-sm font-mono"
                          placeholder="Input"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Expected Output</label>
                        <textarea
                          value={sample.output}
                          onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                          rows={3}
                          className="input-premium text-sm font-mono"
                          placeholder="Output"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Test Cases */}
              <div className="border border-orange-500/30 rounded-xl p-6 bg-orange-500/5">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-orange-400 font-semibold uppercase text-sm tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Hidden Test Cases
                    <span className="text-gray-500 font-normal normal-case">(For evaluation)</span>
                  </label>
                  <button
                    type="button"
                    onClick={addTestcase}
                    className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-semibold flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Testcase
                  </button>
                </div>
                {formData.hiddenTestcases.map((testcase, index) => (
                  <div key={index} className="border border-orange-500/20 rounded-xl p-4 mb-3 bg-charcoal">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-semibold">Testcase {index + 1}</span>
                      {formData.hiddenTestcases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestcase(index)}
                          className="text-red-400 hover:text-red-300 transition-colors text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Input</label>
                        <textarea
                          value={testcase.input}
                          onChange={(e) => handleTestcaseChange(index, 'input', e.target.value)}
                          rows={3}
                          required
                          className="input-premium text-sm font-mono"
                          placeholder="Input"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Expected Output</label>
                        <textarea
                          value={testcase.expected}
                          onChange={(e) => handleTestcaseChange(index, 'expected', e.target.value)}
                          rows={3}
                          required
                          className="input-premium text-sm font-mono"
                          placeholder="Expected Output"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                      Add Problem
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

export default AddProblem;
