import { Link } from 'react-router-dom';

const ExamTerminated = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(244, 197, 66, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 197, 66, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Glowing Border Frame */}
      <div className="relative max-w-2xl w-full">
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-gold to-red-500 rounded-2xl blur-lg opacity-40 animate-pulse"></div>
        
        {/* Main Card */}
        <div className="relative bg-charcoal border-2 border-gold/50 rounded-2xl p-10 text-center shadow-2xl">
          {/* Warning Icon */}
          <div className="relative mb-8">
            <div className="w-28 h-28 mx-auto relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold font-heading text-red-500 mb-4 uppercase tracking-wider">
            Exam Terminated
          </h1>
          
          <p className="text-gold text-lg font-semibold mb-8">
            Auto-Submitted Due to Violation
          </p>

          {/* Warning Box */}
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-red-400 font-bold text-xl uppercase tracking-wider">
                Tab Switch Detected
              </p>
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <p className="text-gray-400">
              Your exam has been automatically submitted due to navigating away from the exam window.
            </p>
          </div>

          {/* Info Text */}
          <p className="text-gray-500 mb-8 leading-relaxed">
            Tab switching or navigating away from the exam page is <span className="text-red-400 font-semibold">strictly prohibited</span> during the examination.
            Your answers submitted until this point have been saved and will be evaluated.
          </p>

          {/* What Happens Now */}
          <div className="bg-black/40 border border-gold/20 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What Happens Now?
            </h3>
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Your MCQ answers (if any) will be evaluated
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Your code submissions (if any) will be evaluated
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Your final score will be calculated
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-red-400">The admin has been notified of the violation</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              to="/results"
              className="btn-primary px-8 py-3.5 text-lg font-bold"
            >
              View My Results
            </Link>
            <Link
              to="/dashboard"
              className="btn-secondary px-8 py-3.5 text-lg font-bold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-gray-700 text-sm">
          © 2025 <span className="text-gold">GCC</span> Hiring Platform
        </p>
      </div>
    </div>
  );
};

export default ExamTerminated;
