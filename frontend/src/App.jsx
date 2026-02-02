import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import HODDashboard from './pages/dashboards/HODDashboard';
import TechnicianDashboard from './pages/dashboards/TechnicianDashboard';
import CitizenDashboard from './pages/dashboards/CitizenDashboard';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/hod/*"
            element={
              <PrivateRoute allowedRoles={['hod']}>
                <HODDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/technician/*"
            element={
              <PrivateRoute allowedRoles={['technician']}>
                <TechnicianDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/citizen/*"
            element={
              <PrivateRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

