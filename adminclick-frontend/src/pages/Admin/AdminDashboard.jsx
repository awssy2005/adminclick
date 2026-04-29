import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/demandes?per_page=5'),
    ]).then(([statsRes, demandesRes]) => {
      setStats(statsRes.data);
      const items = demandesRes.data.data || demandesRes.data;
      setRecentDemandes(Array.isArray(items) ? items.slice(0, 5) : []);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    en_attente: { label: 'En attente', class: 'badge-pending', emoji: '⏳' },
    en_cours: { label: 'En cours', class: 'badge-processing', emoji: '🔄' },
    validee: { label: 'Validée', class: 'badge-approved', emoji: '✅' },
    rejetee: { label: 'Rejetée', class: 'badge-rejected', emoji: '❌' },
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Chargement du panel admin...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-fade-in-up">
          <div>
            <h1 className="admin-title">⚙️ Panel Administrateur</h1>
            <p className="admin-subtitle">Gérez les demandes, les utilisateurs et les statistiques</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="admin-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="admin-stat-card stat-total">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.total_users || 0}</span>
              <span className="admin-stat-label">Utilisateurs</span>
            </div>
          </div>
          <div className="admin-stat-card stat-total">
            <div className="admin-stat-icon">📋</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.total_demandes || 0}</span>
              <span className="admin-stat-label">Total demandes</span>
            </div>
          </div>
          <div className="admin-stat-card stat-pending">
            <div className="admin-stat-icon">⏳</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.en_attente || 0}</span>
              <span className="admin-stat-label">En attente</span>
            </div>
          </div>
          <div className="admin-stat-card stat-processing">
            <div className="admin-stat-icon">🔄</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.en_cours || 0}</span>
              <span className="admin-stat-label">En cours</span>
            </div>
          </div>
          <div className="admin-stat-card stat-approved">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.validee || 0}</span>
              <span className="admin-stat-label">Validées</span>
            </div>
          </div>
          <div className="admin-stat-card stat-rejected">
            <div className="admin-stat-icon">❌</div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{stats?.rejetee || 0}</span>
              <span className="admin-stat-label">Rejetées</span>
            </div>
          </div>
        </div>

        {/* Quick Nav - MODIFIÉ : Ajout du lien vers créer un admin */}
        <div className="admin-nav-grid animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Link to="/admin/demandes" className="admin-nav-card card">
            <div className="card-body">
              <span className="admin-nav-icon">📋</span>
              <h3>Gérer les demandes</h3>
              <p>Consulter, valider ou rejeter les demandes</p>
            </div>
          </Link>
          <Link to="/admin/users" className="admin-nav-card card">
            <div className="card-body">
              <span className="admin-nav-icon">👥</span>
              <h3>Utilisateurs</h3>
              <p>Voir tous les utilisateurs inscrits</p>
            </div>
          </Link>
          {/* 👇 NOUVEAU LIEN : Créer un administrateur */}
          <Link to="/admin/create" className="admin-nav-card card">
            <div className="card-body">
              <span className="admin-nav-icon">➕</span>
              <h3>Créer un admin</h3>
              <p>Ajouter un nouvel administrateur</p>
            </div>
          </Link>
          <Link to="/admin/logs" className="admin-nav-card card">
            <div className="card-body">
              <span className="admin-nav-icon">📜</span>
              <h3>Logs d'activité</h3>
              <p>Historique des actions administratives</p>
            </div>
          </Link>
        </div>

        {/* Recent Demandes - Inchangé */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body">
            <div className="admin-section-header">
              <h2>📋 Demandes récentes</h2>
              <Link to="/admin/demandes" className="btn btn-sm btn-secondary">Voir tout →</Link>
            </div>
            {recentDemandes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: 'var(--space-lg)' }}>Aucune demande</p>
            ) : (
              <div className="table-wrapper" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Utilisateur</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDemandes.map(d => (
                      <tr key={d.id}>
                        <td><strong>#{d.id}</strong></td>
                        <td>{d.user?.name || '—'}</td>
                        <td>{d.type}</td>
                        <td>
                          <span className={`badge ${statusConfig[d.status]?.class}`}>
                            {statusConfig[d.status]?.emoji} {statusConfig[d.status]?.label}
                          </span>
                        </td>
                        <td>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}