import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateDemande from './pages/Demandes/CreateDemande';
import DemandesList from './pages/Demandes/DemandesList';
import DemandeDetail from './pages/Demandes/DemandeDetail';
import Notifications from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import CINProcess from './pages/CIN/CINProcess';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDemandes from './pages/Admin/AdminDemandes';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminLogs from './pages/Admin/AdminLogs';
import AdminCreate from './pages/Admin/AdminCreate'; 
import './index.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected — Citizen */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/demandes" element={<ProtectedRoute><DemandesList /></ProtectedRoute>} />
            <Route path="/demandes/create" element={<ProtectedRoute><CreateDemande /></ProtectedRoute>} />
            <Route path="/demandes/:id" element={<ProtectedRoute><DemandeDetail /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* CIN Process */}
            <Route path="/cin" element={<ProtectedRoute><CINProcess /></ProtectedRoute>} />

            {/* Admin Only */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/demandes" element={<ProtectedRoute adminOnly><AdminDemandes /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute adminOnly><AdminLogs /></ProtectedRoute>} />
            <Route path="/admin/create" element={<ProtectedRoute adminOnly><AdminCreate /></ProtectedRoute>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}