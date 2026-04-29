import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './DemandesList.css';

export default function DemandesList() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDemandes = (page = 1) => {
    setLoading(true);
    api.get(`/demandes?page=${page}`)
      .then(res => {
        // Gestion de la réponse paginée
        const data = res.data;
        setDemandes(data.data || data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
        setTotal(data.total || (data.data || data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

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

  const filtered = filter === 'all' ? demandes : demandes.filter(d => d.status === filter);

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="demandes-page">
      <div className="container">
        <div className="demandes-header animate-fade-in-up">
          <div>
            <h1 className="demandes-title">📋 Mes demandes</h1>
            <p className="demandes-subtitle">{total} demande(s) au total</p>
          </div>
          <Link to="/demandes/create" className="btn btn-primary">+ Nouvelle demande</Link>
        </div>

        {/* Filters */}
        <div className="demandes-filters animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'en_attente', label: 'En attente' },
            { key: 'en_cours', label: 'En cours' },
            { key: 'validee', label: 'Validées' },
            { key: 'rejetee', label: 'Rejetées' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Demandes grid */}
        {filtered.length === 0 ? (
          <div className="dash-empty card animate-fade-in-up">
            <p style={{ padding: 'var(--space-2xl)' }}>Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="demandes-grid">
            {filtered.map((d, i) => (
              <Link
                to={`/demandes/${d.id}`}
                key={d.id}
                className="demande-card card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="card-body">
                  <div className="demande-card-header">
                    <span className="demande-card-id">#{d.id}</span>
                    <span className={`badge ${statusConfig[d.status]?.class}`}>
                      {statusConfig[d.status]?.label}
                    </span>
                  </div>
                  <h3 className="demande-card-type">{typeLabels[d.type] || d.type}</h3>
                  {d.description && (
                    <p className="demande-card-desc">{d.description.substring(0, 100)}</p>
                  )}
                  <div className="demande-card-footer">
                    <span className="demande-card-date">
                      📅 {new Date(d.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="demande-card-docs">
                      📎 {d.documents?.length || 0} doc(s)
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pagination animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              className="btn btn-sm btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => fetchDemandes(currentPage - 1)}
            >
              ← Précédent
            </button>
            <span className="pagination-info">
              Page {currentPage} sur {lastPage}
            </span>
            <button
              className="btn btn-sm btn-secondary"
              disabled={currentPage >= lastPage}
              onClick={() => fetchDemandes(currentPage + 1)}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
