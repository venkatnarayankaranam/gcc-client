import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '@monaco-editor/react';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState('mcq');
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [codeResults, setCodeResults] = useState({});
  const tabSwitchDetected = useRef(false);

  const languageTemplates = {
    c: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
    python: '# Your code here\n',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
    javascript: '// Your code here\n'
  };

  const handleForceSubmit = useCallback(async () => {
    if (tabSwitchDetected.current) return;
    tabSwitchDetected.current = true;

    try {
      const mcqAnswersArray = Object.entries(mcqAnswers).map(([mcqId, selectedIndex]) => ({
        mcqId,
        selectedIndex
      }));

      const codingSubmissions = exam?.codingProblems?.map(p => ({
        problemId: p._id
      })) || [];

      await api.post(`/exams/${id}/force-submit`, {
        tabSwitch: true,
        mcqAnswers: mcqAnswersArray,
        codingSubmissions
      });

      navigate('/exam/terminated');
    } catch (err) {
      console.error('Force submit error:', err);
      navigate('/exam/terminated');
    }
  }, [id, mcqAnswers, exam, navigate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !tabSwitchDetected.current) {
        handleForceSubmit();
      }
    };

    const handleBlur = () => {
      if (!tabSwitchDetected.current) {
        handleForceSubmit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleForceSubmit]);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const fetchExam = async () => {
    try {
      const response = await api.get(`/exams/${id}`);
      setExam(response.data.exam);
      if (response.data.exam.sections.includes('mcq')) {
        setCurrentSection('mcq');
      } else {
        setCurrentSection('coding');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load exam');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMcqSelect = (mcqId, optionIndex) => {
    setMcqAnswers({ ...mcqAnswers, [mcqId]: optionIndex });
  };

  const handleMcqSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = Object.entries(mcqAnswers).map(([mcqId, selectedIndex]) => ({
        mcqId,
        selectedIndex
      }));

      await api.post(`/exams/${id}/submit-mcqs`, { answers: answersArray });

      if (exam.sections.includes('coding')) {
        setCurrentSection('coding');
      } else {
        await handleFinalSubmit();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit MCQs');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const currentProblem = exam.codingProblems[currentProblemIndex];
      const response = await api.post(`/exams/${id}/submit-code`, {
        problemId: currentProblem._id,
        language,
        code
      });

      setCodeResults({
        ...codeResults,
        [currentProblem._id]: response.data
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post(`/exams/${id}/final-submit`);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const getLanguageForEditor = () => {
    const mapping = {
      c: 'c',
      cpp: 'cpp',
      python: 'python',
      java: 'java',
      javascript: 'javascript'
    };
    return mapping[language] || 'plaintext';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-gradient">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-gradient">
        <div className="card-premium p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Premium Exam Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/90 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">{exam?.title}</h1>
            <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded uppercase tracking-wider">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            {exam?.sections.map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  currentSection === section
                    ? 'bg-gold-gradient text-black shadow-gold-glow'
                    : 'bg-graysoft text-gray-400 hover:text-gold hover:border-gold/30 border border-transparent'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
          <div className="bg-red-900/80 backdrop-blur-xl border border-red-500/50 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <main className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* MCQ Section */}
          {currentSection === 'mcq' && exam?.mcqs?.length > 0 && (
            <div className="card-premium p-8 fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                    MCQ <span className="text-gold">Section</span>
                  </h2>
                  <p className="text-gray-400 mt-1">Select the correct answer</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Question</span>
                  <span className="text-3xl font-bold text-gold">{currentMcqIndex + 1}</span>
                  <span className="text-gray-400">of {exam.mcqs.length}</span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="bg-graysoft rounded-xl p-6 border border-gold/20 mb-6">
                  <p className="text-lg text-white leading-relaxed">
                    {exam.mcqs[currentMcqIndex].question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {exam.mcqs[currentMcqIndex].options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        mcqAnswers[exam.mcqs[currentMcqIndex]._id] === idx
                          ? 'border-gold bg-gold/10 shadow-gold-glow-sm'
                          : 'border-graysoft bg-graysoft hover:border-gold/40'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
                        mcqAnswers[exam.mcqs[currentMcqIndex]._id] === idx
                          ? 'border-gold bg-gold'
                          : 'border-gray-500'
                      }`}>
                        {mcqAnswers[exam.mcqs[currentMcqIndex]._id] === idx && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={`${
                        mcqAnswers[exam.mcqs[currentMcqIndex]._id] === idx
                          ? 'text-gold'
                          : 'text-gray-300'
                      }`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentMcqIndex(Math.max(0, currentMcqIndex - 1))}
                  disabled={currentMcqIndex === 0}
                  className="btn-secondary px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Question Pills */}
                <div className="flex gap-2 flex-wrap justify-center max-w-md">
                  {exam.mcqs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMcqIndex(idx)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                        idx === currentMcqIndex
                          ? 'bg-gold-gradient text-black shadow-gold-glow'
                          : mcqAnswers[exam.mcqs[idx]._id] !== undefined
                          ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                          : 'bg-graysoft text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {currentMcqIndex === exam.mcqs.length - 1 ? (
                  <button
                    onClick={handleMcqSubmit}
                    disabled={submitting}
                    className="btn-primary px-6 py-3 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit MCQs →'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentMcqIndex(currentMcqIndex + 1)}
                    className="btn-primary px-6 py-3"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Coding Section */}
          {currentSection === 'coding' && exam?.codingProblems?.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6 fade-in">
              {/* Problem Statement */}
              <div className="card-premium p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gold">
                    {exam.codingProblems[currentProblemIndex].title}
                  </h2>
                  <div className="flex gap-2">
                    {exam.codingProblems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentProblemIndex(idx)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                          idx === currentProblemIndex
                            ? 'bg-gold-gradient text-black shadow-gold-glow'
                            : codeResults[exam.codingProblems[idx]._id]?.verdict === 'accepted'
                            ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                            : 'bg-graysoft text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {exam.codingProblems[currentProblemIndex].statement}
                  </p>
                </div>

                {/* Sample Test Cases */}
                <div className="mb-6">
                  <h3 className="font-bold text-gold mb-3 uppercase tracking-wider text-sm">Sample Test Cases</h3>
                  {exam.codingProblems[currentProblemIndex].samples.map((sample, idx) => (
                    <div key={idx} className="bg-graysoft rounded-xl p-4 mb-3 border border-gold/10">
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Input</span>
                        <pre className="bg-black/50 p-3 rounded-lg mt-1 text-green-400 font-mono text-sm overflow-x-auto">{sample.input}</pre>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-500">Output</span>
                        <pre className="bg-black/50 p-3 rounded-lg mt-1 text-gold font-mono text-sm overflow-x-auto">{sample.output}</pre>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="flex gap-4 text-sm">
                  <div className="px-3 py-2 bg-graysoft rounded-lg border border-gold/10">
                    <span className="text-gray-500">Time:</span>
                    <span className="text-gold ml-2">{exam.codingProblems[currentProblemIndex].timeLimitMs}ms</span>
                  </div>
                  <div className="px-3 py-2 bg-graysoft rounded-lg border border-gold/10">
                    <span className="text-gray-500">Memory:</span>
                    <span className="text-gold ml-2">{exam.codingProblems[currentProblemIndex].memoryLimitMb}MB</span>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="card-premium p-6">
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-premium px-4 py-2 w-40 cursor-pointer"
                  >
                    <option value="c" className="bg-charcoal">C</option>
                    <option value="cpp" className="bg-charcoal">C++</option>
                    <option value="python" className="bg-charcoal">Python</option>
                    <option value="java" className="bg-charcoal">Java</option>
                    <option value="javascript" className="bg-charcoal">JavaScript</option>
                  </select>

                  <button
                    onClick={handleCodeSubmit}
                    disabled={submitting}
                    className="btn-primary px-6 py-2 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running...
                      </>
                    ) : (
                      <>▶ Submit Code</>
                    )}
                  </button>
                </div>

                <div className="border border-gold/20 rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
                  <Editor
                    height="100%"
                    language={getLanguageForEditor()}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16 }
                    }}
                  />
                </div>

                {/* Results */}
                {codeResults[exam.codingProblems[currentProblemIndex]._id] && (
                  <div className={`p-4 rounded-xl border ${
                    codeResults[exam.codingProblems[currentProblemIndex]._id].verdict === 'accepted'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {codeResults[exam.codingProblems[currentProblemIndex]._id].verdict === 'accepted' ? '✅' : '❌'}
                        </span>
                        <span className="font-bold uppercase tracking-wider">
                          {codeResults[exam.codingProblems[currentProblemIndex]._id].verdict}
                        </span>
                      </div>
                      <span className="font-mono">
                        Score: {codeResults[exam.codingProblems[currentProblemIndex]._id].score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Final Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>🏁 Final Submit</>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamPage;
