import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, en_attente: 0, en_cours: 0, validee: 0, rejetee: 0 });
  const [demandes, setDemandes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/demandes/stats'),
      api.get('/demandes'),
      api.get('/notifications'),
    ]).then(([statsRes, demandesRes, notifsRes]) => {
      setStats(statsRes.data);
      // Gestion réponse paginée : les items sont dans .data.data
      const demandesData = demandesRes.data.data || demandesRes.data;
      setDemandes(Array.isArray(demandesData) ? demandesData.slice(0, 5) : []);
      setNotifications(notifsRes.data.slice(0, 5));
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const typeLabels = {
    acte_naissance: 'Acte de Naissance',
    certificat_residence: 'Certificat de Résidence',
    carte_nationale: "Carte Nationale d'Identité",
    extrait_casier: 'Extrait de Casier Judiciaire',
    attestation_travail: 'Attestation de Travail',
  };

  const statusConfig = {
    en_attente: { label: 'En attente', class: 'badge-pending', dot: 'pending' },
    en_cours: { label: 'En cours', class: 'badge-processing', dot: 'processing' },
    validee: { label: 'Validée', class: 'badge-approved', dot: 'approved' },
    rejetee: { label: 'Rejetée', class: 'badge-rejected', dot: 'rejected' },
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Chargement du tableau de bord...</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome */}
        <div className="dash-welcome animate-fade-in-up">
          <div>
            <h1 className="dash-welcome-title">Bonjour, {user?.name} 👋</h1>
            <p className="dash-welcome-sub">Voici un aperçu de vos démarches administratives</p>
          </div>
          <Link to="/demandes/create" className="btn btn-primary">
            ✨ Nouvelle demande
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-label">Total demandes</span>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-num">{stats.en_attente}</span>
              <span className="stat-label">En attente</span>
            </div>
          </div>
          <div className="stat-card stat-processing">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <span className="stat-num">{stats.en_cours}</span>
              <span className="stat-label">En cours</span>
            </div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-num">{stats.validee}</span>
              <span className="stat-label">Validées</span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="dash-grid">
          {/* Recent Demandes */}
          <div className="dash-section card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="dash-section-header">
              <h2 className="dash-section-title">📋 Demandes récentes</h2>
              <Link to="/demandes" className="dash-section-link">Voir tout →</Link>
            </div>
            <div className="dash-section-body">
              {demandes.length === 0 ? (
                <div className="dash-empty">
                  <p>Aucune demande pour le moment</p>
                  <Link to="/demandes/create" className="btn btn-sm btn-primary">Faire une demande</Link>
                </div>
              ) : (
                <div className="demande-list">
                  {demandes.map((d) => (
                    <Link to={`/demandes/${d.id}`} key={d.id} className="demande-item">
                      <div className="demande-item-info">
                        <span className="demande-item-id">#{d.id}</span>
                        <span className="demande-item-type">{typeLabels[d.type] || d.type}</span>
                      </div>
                      <div className="demande-item-meta">
                        <span className={`badge ${statusConfig[d.status]?.class}`}>
                          {statusConfig[d.status]?.label}
                        </span>
                        <span className="demande-item-date">
                          {new Date(d.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="dash-section card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="dash-section-header">
              <h2 className="dash-section-title">🔔 Notifications</h2>
              <Link to="/notifications" className="dash-section-link">Voir tout →</Link>
            </div>
            <div className="dash-section-body">
              {notifications.length === 0 ? (
                <div className="dash-empty">
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`notif-item ${!n.is_read ? 'notif-unread' : ''}`}>
                      <div className={`notif-type-dot notif-dot-${n.type}`}></div>
                      <div className="notif-content">
                        <span className="notif-title">{n.title}</span>
                        <span className="notif-msg">{n.message}</span>
                        <span className="notif-time">{new Date(n.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-quick animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="dash-section-title">⚡ Actions rapides</h2>
          <div className="quick-grid">
            <Link to="/cin" className="quick-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.03)' }}>
              <span className="quick-icon">🪪</span>
              <span className="quick-label">Demande CIN</span>
            </Link>
            <Link to="/demandes/create" className="quick-card">
              <span className="quick-icon">📝</span>
              <span className="quick-label">Nouvelle demande</span>
            </Link>
            <Link to="/demandes" className="quick-card">
              <span className="quick-icon">📋</span>
              <span className="quick-label">Mes demandes</span>
            </Link>
            <Link to="/notifications" className="quick-card">
              <span className="quick-icon">🔔</span>
              <span className="quick-label">Notifications</span>
            </Link>
            <Link to="/profile" className="quick-card">
              <span className="quick-icon">👤</span>
              <span className="quick-label">Mon profil</span>
            </Link>
            <Link to="/services" className="quick-card">
              <span className="quick-icon">🏛️</span>
              <span className="quick-label">Services</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
