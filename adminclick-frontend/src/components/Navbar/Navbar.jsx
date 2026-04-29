import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../api';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('adminclick_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('adminclick_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications/unread-count')
        .then(res => setUnreadCount(res.data.count))
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="logo-text">Admin<span className="logo-accent">Click</span></span>
          {isAdmin && <span className="badge badge-admin">Admin</span>}
        </Link>

        <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Démarches</Link>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                    ⚙️ Panel Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Tableau de bord</Link>
                  <Link to="/demandes" className={`nav-link ${location.pathname.startsWith('/demandes') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Mes demandes</Link>
                </>
              )}
              <Link to="/notifications" className="nav-link nav-link-icon" onClick={() => setMenuOpen(false)}>
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </Link>
              <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="nav-user">
                <Link to="/profile" className="nav-user-name" onClick={() => setMenuOpen(false)}>
                  👤 {user?.name}
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-secondary">Déconnexion</button>
              </div>
            </>
          ) : (
            <>
              <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="nav-auth">
                <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link to="/register" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>Inscription</Link>
              </div>
            </>
          )}
        </nav>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
