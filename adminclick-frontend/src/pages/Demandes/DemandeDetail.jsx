import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import './DemandeDetail.css';

export default function DemandeDetail() {
  const { id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/demandes/${id}`)
      .then(res => setDemande(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const typeLabels = {
    acte_naissance: 'Acte de Naissance',
    certificat_residence: 'Certificat de Résidence',
    carte_nationale: "Carte Nationale d'Identité",
    extrait_casier: 'Extrait de Casier Judiciaire',
    attestation_travail: 'Attestation de Travail',
  };

  const statusConfig = {
    en_attente: { label: 'En attente', class: 'badge-pending', color: 'var(--warning-500)', step: 1 },
    en_cours: { label: 'En cours de traitement', class: 'badge-processing', color: 'var(--primary-500)', step: 2 },
    validee: { label: 'Validée', class: 'badge-approved', color: 'var(--accent-500)', step: 3 },
    rejetee: { label: 'Rejetée', class: 'badge-rejected', color: 'var(--error-500)', step: 3 },
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!demande) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="dash-empty card"><p>Demande introuvable</p></div>
        </div>
      </div>
    );
  }

  const config = statusConfig[demande.status] || statusConfig.en_attente;

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/demandes" className="detail-back animate-fade-in">← Retour aux demandes</Link>

        <div className="detail-header animate-fade-in-up">
          <div>
            <h1 className="detail-title">Demande #{demande.id}</h1>
            <p className="detail-type">{typeLabels[demande.type] || demande.type}</p>
          </div>
          <span className={`badge ${config.class}`} style={{ fontSize: '0.875rem', padding: '8px 20px' }}>
            {config.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="detail-progress card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body">
            <h2 className="detail-section-title">Suivi de la demande</h2>
            <div className="progress-track">
              {['Soumise', 'En traitement', demande.status === 'rejetee' ? 'Rejetée' : 'Validée'].map((step, i) => (
                <div key={i} className={`progress-step ${i < config.step ? 'completed' : ''} ${i === config.step - 1 ? 'current' : ''}`}>
                  <div className="progress-dot">{i < config.step ? '✓' : i + 1}</div>
                  <span className="progress-label">{step}</span>
                </div>
              ))}
              <div className="progress-line">
                <div className="progress-line-fill" style={{ width: `${((config.step - 1) / 2) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          {/* Info */}
          <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-body">
              <h2 className="detail-section-title">Informations</h2>
              <div className="detail-info-list">
                <div className="detail-info-row">
                  <span className="detail-info-label">Référence</span>
                  <span className="detail-info-value">#{demande.id}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Type</span>
                  <span className="detail-info-value">{typeLabels[demande.type] || demande.type}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Date de soumission</span>
                  <span className="detail-info-value">{new Date(demande.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="detail-info-row">
                  <span className="detail-info-label">Dernière mise à jour</span>
                  <span className="detail-info-value">{new Date(demande.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {demande.description && (
                  <div className="detail-info-row detail-info-full">
                    <span className="detail-info-label">Description</span>
                    <span className="detail-info-value">{demande.description}</span>
                  </div>
                )}
                {demande.notes && (
                  <div className="detail-info-row detail-info-full">
                    <span className="detail-info-label">Notes administratives</span>
                    <span className="detail-info-value">{demande.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-body">
              <h2 className="detail-section-title">Documents joints</h2>
              {demande.documents && demande.documents.length > 0 ? (
                <div className="detail-docs">
                  {demande.documents.map(doc => (
                    <div key={doc.id} className="detail-doc-item">
                      <span className="detail-doc-icon">📄</span>
                      <div className="detail-doc-info">
                        <span className="detail-doc-name">{doc.name}</span>
                        <span className="detail-doc-size">{doc.file_type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} Ko` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-empty">Aucun document joint</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
