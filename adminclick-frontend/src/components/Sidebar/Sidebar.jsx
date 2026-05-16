import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './Sidebar.css';

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Overlay pour fermer en mobile */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <span className="sidebar-logo">AdminClick</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            🏠 {t('الرئيسية', 'Accueil')}
          </NavLink>
          <NavLink to="/services" className={linkClass} onClick={onClose}>
            📋 {t('الخدمات', 'Démarches')}
          </NavLink>

          {isAuthenticated ? (
            isAdmin ? (
              <NavLink to="/admin" className={linkClass} onClick={onClose}>
                ⚙️ {t('لوحة التحكم', 'Panel Admin')}
              </NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
                  📊 {t('لوحة القيادة', 'Tableau de bord')}
                </NavLink>
                <NavLink to="/demandes" className={linkClass} onClick={onClose}>
                  📄 {t('طلباتي', 'Mes demandes')}
                </NavLink>
                <NavLink to="/vault" className={linkClass} onClick={onClose}>
                  🗄️ {t('الخزينة', 'Coffre-fort')}
                </NavLink>
              </>
            )
          ) : null}

          {/* Liens communs */}
          {isAuthenticated && (
            <>
              <NavLink to="/notifications" className={linkClass} onClick={onClose}>
                🔔 {t('الإشعارات', 'Notifications')}
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={onClose}>
                👤 {t('الملف الشخصي', 'Profil')}
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}