import { useState, useEffect } from 'react';
import api from '../../api';
import './Admin.css';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchLogs = (page = 1) => {
    setLoading(true);
    api.get(`/admin/activity-logs?page=${page}`)
      .then(res => {
        const data = res.data;
        setLogs(data.data || data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionLabels = {
    status_changed: '🔄 Changement de statut',
    user_registered: '👤 Nouvelle inscription',
    demande_created: '📝 Nouvelle demande',
    payment_made: '💳 Paiement effectué',
  };

  if (loading && logs.length === 0) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-fade-in-up">
          <div>
            <h1 className="admin-title">📜 Logs d'activité</h1>
            <p className="admin-subtitle">Historique complet des actions sur la plateforme</p>
          </div>
        </div>

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Admin</th>
                    <th>Demande</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>Aucun log d'activité</td></tr>
                  ) : logs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(log.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <span className="badge badge-processing">
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.description || '—'}
                      </td>
                      <td>{log.admin?.name || '—'}</td>
                      <td>{log.demande_id ? `#${log.demande_id}` : '—'}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.ip_address || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {lastPage > 1 && (
          <div className="pagination animate-fade-in-up">
            <button className="btn btn-sm btn-secondary" disabled={currentPage <= 1} onClick={() => fetchLogs(currentPage - 1)}>← Précédent</button>
            <span className="pagination-info">Page {currentPage} sur {lastPage}</span>
            <button className="btn btn-sm btn-secondary" disabled={currentPage >= lastPage} onClick={() => fetchLogs(currentPage + 1)}>Suivant →</button>
          </div>
        )}
      </div>
    </div>
  );
}
