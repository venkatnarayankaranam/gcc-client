import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'KIET'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-darkgold/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          {/* Decorative Lines */}
          <div className="absolute -top-20 -left-20 w-40 h-40 border border-gold/20 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 border border-gold/10 rounded-full"></div>
          
          <h1 className="text-6xl font-extrabold font-heading mb-6">
            <span className="text-gold-gradient">GCC</span>
          </h1>
          <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-wider">
            Hiring Platform
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Join the elite. Prove your skills. Get hired by top companies through our advanced assessment platform.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🎯', text: 'MCQ & Coding Challenges' },
              { icon: '⚡', text: 'Real-time Code Execution' },
              { icon: '🏆', text: 'Instant Results & Ranking' },
              { icon: '🔒', text: 'Proctored Assessments' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 text-gray-300">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            {[
              { value: '10K+', label: 'Students' },
              { value: '500+', label: 'Exams' },
              { value: '95%', label: 'Placement' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-extrabold font-heading">
              <span className="text-gold-gradient">GCC</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase mt-1">Hiring Platform</p>
          </div>

          {/* Card */}
          <div className="bg-charcoal/80 backdrop-blur-xl rounded-2xl p-8 border border-goldglow shadow-gold-glow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-heading text-white uppercase tracking-wide">
                Create <span className="text-gold">Account</span>
              </h2>
              <p className="text-gray-400 mt-2">Join the GCC community</p>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="2024CS001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">College</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="input-premium cursor-pointer"
                >
                  <option value="KIET" className="bg-charcoal">KIET</option>
                  <option value="KIET+" className="bg-charcoal">KIET+</option>
                  <option value="KIET-W" className="bg-charcoal">KIET-W</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input-premium"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-bold uppercase tracking-wider mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-gold font-semibold hover:text-darkgold transition-colors hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            © 2025 GCC Hiring Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
