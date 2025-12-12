import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamPage from './pages/ExamPage';
import ExamTerminated from './pages/ExamTerminated';
import Results from './pages/Results';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateExam from './pages/admin/CreateExam';
import AddMCQ from './pages/admin/AddMCQ';
import AddProblem from './pages/admin/AddProblem';
import ViewResults from './pages/admin/ViewResults';
import ExamDetails from './pages/admin/ExamDetails';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/exam/:id" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
          <Route path="/exam/terminated" element={<PrivateRoute><ExamTerminated /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
          
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/exams/create" element={<PrivateRoute adminOnly><CreateExam /></PrivateRoute>} />
          <Route path="/admin/exams/:id" element={<PrivateRoute adminOnly><ExamDetails /></PrivateRoute>} />
          <Route path="/admin/mcqs/add" element={<PrivateRoute adminOnly><AddMCQ /></PrivateRoute>} />
          <Route path="/admin/problems/add" element={<PrivateRoute adminOnly><AddProblem /></PrivateRoute>} />
          <Route path="/admin/results" element={<PrivateRoute adminOnly><ViewResults /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
