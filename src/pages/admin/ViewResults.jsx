import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('');
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [filter, examFilter]);

  const fetchExams = async () => {
    try {
      const response = await api.get('/admin/exams');
      setExams(response.data.exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchResults = async () => {
    try {
      let url = '/admin/results?';
      if (filter === 'tabSwitch') url += 'tabSwitchOnly=true&';
      if (examFilter) url += `examId=${examFilter}`;
      
      const response = await api.get(url);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Roll No', 'Email', 'College', 'Exam', 'MCQ Score', 'Coding Score', 'Total Score', 'Tab Switch', 'Termination Reason', 'Status', 'Submitted At'];
    const rows = results.map(r => [
      r.userId?.name || '',
      r.userId?.rollNo || '',
      r.userId?.email || '',
      r.userId?.college || '',
      r.examId?.title || '',
      r.mcqScore,
      r.codingScore,
      r.totalScore,
      r.tabSwitch ? 'Yes' : 'No',
      r.terminationReason || '-',
      r.status,
      r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-white uppercase tracking-wide flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              View <span className="text-gold">Results</span>
            </h2>
            <p className="text-gray-400 mt-2 ml-13">Monitor exam submissions and candidate performance</p>
          </div>

          {/* Filters */}
          <div className="card-premium p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input-premium px-4 py-2.5"
                >
                  <option value="all">All Submissions</option>
                  <option value="tabSwitch">Tab Switch Only</option>
                </select>

                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="input-premium px-4 py-2.5"
                >
                  <option value="">All Exams</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>{exam.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={downloadCSV}
                className="btn-primary px-6 py-2.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400">No submissions match the selected filters.</p>
            </div>
          ) : (
            <div className="card-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>College</th>
                      <th>Exam</th>
                      <th>MCQ</th>
                      <th>Coding</th>
                      <th>Total</th>
                      <th>Tab Switch</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result._id} className={result.tabSwitch ? 'bg-red-500/5' : ''}>
                        <td className="font-semibold text-white">{result.userId?.name || '-'}</td>
                        <td>{result.userId?.rollNo || '-'}</td>
                        <td>
                          <span className="text-gold">{result.userId?.college || '-'}</span>
                        </td>
                        <td>{result.examId?.title || '-'}</td>
                        <td>
                          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-semibold">{result.mcqScore}</span>
                        </td>
                        <td>
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg font-semibold">{result.codingScore}</span>
                        </td>
                        <td>
                          <span className="bg-gold/20 text-gold px-3 py-1 rounded-lg font-bold">{result.totalScore}</span>
                        </td>
                        <td>
                          {result.tabSwitch ? (
                            <span className="badge-danger flex items-center gap-1 w-fit">
                              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td>
                          {result.status === 'auto_submitted' ? (
                            <span className="badge-danger">Auto Submitted</span>
                          ) : result.status === 'submitted' ? (
                            <span className="badge-success">Submitted</span>
                          ) : (
                            <span className="badge-warning">In Progress</span>
                          )}
                        </td>
                        <td className="text-gray-500 text-sm">
                          {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-4 gap-6">
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-3xl font-extrabold text-gold">{results.length}</p>
              <p className="text-gray-500 text-sm mt-1">Total Submissions</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-extrabold text-green-400">
                {results.filter(r => r.status === 'submitted').length}
              </p>
              <p className="text-gray-500 text-sm mt-1">Normal Submissions</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-3xl font-extrabold text-red-400">
                {results.filter(r => r.tabSwitch).length}
              </p>
              <p className="text-gray-500 text-sm mt-1">Tab Switch Detected</p>
            </div>
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-3xl font-extrabold text-purple-400">
                {results.length > 0 ? (results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(1) : 0}
              </p>
              <p className="text-gray-500 text-sm mt-1">Average Score</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewResults;
