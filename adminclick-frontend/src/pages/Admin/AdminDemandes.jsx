import { useState, useEffect } from 'react';
import api from '../../api';
import './Admin.css';

export default function AdminDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDemandes = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (filter !== 'all') params.append('status', filter);
    
    api.get(`/admin/demandes?${params}`)
      .then(res => {
        const data = res.data;
        setDemandes(data.data || data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDemandes();
  }, [filter]);

  const typeLabels = {
    acte_naissance: 'Acte de Naissance',
    certificat_residence: 'Certificat de Résidence',
    carte_nationale: "Carte Nationale d'Identité",
    extrait_casier: 'Extrait de Casier Judiciaire',
    attestation_travail: 'Attestation de Travail',
  };

  const statusConfig = {
    en_attente: { label: 'En attente', class: 'badge-pending' },
    en_cours: { label: 'En cours', class: 'badge-processing' },
    validee: { label: 'Validée', class: 'badge-approved' },
    rejetee: { label: 'Rejetée', class: 'badge-rejected' },
  };

  const handleUpdateStatus = async () => {
    if (!selectedDemande || !newStatus) return;
    setUpdating(true);
    setMessage('');
    try {
      await api.put(`/admin/demandes/${selectedDemande.id}/status`, {
        status: newStatus,
        notes: notes,
      });
      setMessage('✅ Statut mis à jour avec succès !');
      setSelectedDemande(null);
      setNewStatus('');
      setNotes('');
      fetchDemandes(currentPage);
    } catch (err) {
      setMessage('❌ Erreur lors de la mise à jour.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && demandes.length === 0) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-fade-in-up">
          <div>
            <h1 className="admin-title">📋 Gestion des demandes</h1>
            <p className="admin-subtitle">Consulter et mettre à jour le statut des demandes</p>
          </div>
        </div>

        {message && (
          <div className={`admin-message animate-fade-in-up ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="demandes-filters animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'en_attente', label: '⏳ En attente' },
            { key: 'en_cours', label: '🔄 En cours' },
            { key: 'validee', label: '✅ Validées' },
            { key: 'rejetee', label: '❌ Rejetées' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => { setFilter(f.key); setCurrentPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status update modal */}
        {selectedDemande && (
          <div className="admin-modal-overlay" onClick={() => setSelectedDemande(null)}>
            <div className="admin-modal card animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="card-body">
                <h2 style={{ marginBottom: 'var(--space-lg)' }}>Modifier le statut — Demande #{selectedDemande.id}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                  <strong>Type:</strong> {typeLabels[selectedDemande.type] || selectedDemande.type}<br />
                  <strong>Utilisateur:</strong> {selectedDemande.user?.name} ({selectedDemande.user?.email})
                </p>
                <div className="form-group">
                  <label className="form-label">Nouveau statut</label>
                  <select className="form-input form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="">-- Sélectionner --</option>
                    <option value="en_attente">⏳ En attente</option>
                    <option value="en_cours">🔄 En cours de traitement</option>
                    <option value="validee">✅ Validée</option>
                    <option value="rejetee">❌ Rejetée</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optionnel)</label>
                  <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ajouter une note pour le citoyen..."></textarea>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedDemande(null)}>Annuler</button>
                  <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={!newStatus || updating}>
                    {updating ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Mettre à jour'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.map(d => (
                    <tr key={d.id}>
                      <td><strong>#{d.id}</strong></td>
                      <td>
                        <div>{d.user?.name}</div>
                        <small style={{ color: 'var(--text-muted)' }}>{d.user?.email}</small>
                      </td>
                      <td>{typeLabels[d.type] || d.type}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.description || '—'}
                      </td>
                      <td>
                        <span className={`badge ${statusConfig[d.status]?.class}`}>
                          {statusConfig[d.status]?.label}
                        </span>
                      </td>
                      <td>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => { setSelectedDemande(d); setNewStatus(d.status); setNotes(d.notes || ''); }}>
                          ✏️ Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pagination animate-fade-in-up">
            <button className="btn btn-sm btn-secondary" disabled={currentPage <= 1} onClick={() => fetchDemandes(currentPage - 1)}>
              ← Précédent
            </button>
            <span className="pagination-info">Page {currentPage} sur {lastPage}</span>
            <button className="btn btn-sm btn-secondary" disabled={currentPage >= lastPage} onClick={() => fetchDemandes(currentPage + 1)}>
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
