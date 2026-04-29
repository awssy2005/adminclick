import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './CreateDemande.css';

export default function CreateDemande() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const serviceTypes = [
    { id: 'acte_naissance', name: 'Acte de Naissance', icon: '👶', desc: 'Copie intégrale ou extrait' },
    { id: 'certificat_residence', name: 'Certificat de Résidence', icon: '🏠', desc: 'Attestation de domicile' },
    { id: 'carte_nationale', name: "Carte Nationale d'Identité", icon: '🪪', desc: 'Création ou renouvellement' },
    { id: 'extrait_casier', name: 'Extrait de Casier Judiciaire', icon: '⚖️', desc: 'Bulletin n°3' },
    { id: 'attestation_travail', name: 'Attestation de Travail', icon: '💼', desc: 'Certificat employeur' },
  ];

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) {
      setError('Veuillez sélectionner un type de document.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    files.forEach(file => formData.append('files[]', file));

    try {
      const res = await api.post('/demandes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(`Demande #${res.data.id} soumise avec succès !`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-demande">
      <div className="container">
        <div className="create-header animate-fade-in-up">
          <h1 className="create-title">📝 Nouvelle demande</h1>
          <p className="create-subtitle">Sélectionnez le type de document et remplissez le formulaire</p>
        </div>

        {success && (
          <div className="create-success animate-fade-in-up">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="auth-error animate-fade-in-up" style={{ maxWidth: 700, margin: '0 auto var(--space-lg)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-form animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Service type selection */}
          <div className="form-section">
            <h2 className="form-section-title">Type de document</h2>
            <div className="service-select-grid">
              {serviceTypes.map((s) => (
                <label
                  key={s.id}
                  className={`service-select-card ${type === s.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={s.id}
                    checked={type === s.id}
                    onChange={(e) => setType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="service-select-icon">{s.icon}</span>
                  <span className="service-select-name">{s.name}</span>
                  <span className="service-select-desc">{s.desc}</span>
                  {type === s.id && <span className="service-select-check">✓</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2 className="form-section-title">Informations complémentaires</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="description">Description (optionnel)</label>
              <textarea
                id="description"
                className="form-input form-textarea"
                placeholder="Ajoutez des détails ou précisions sur votre demande..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* File upload */}
          <div className="form-section">
            <h2 className="form-section-title">Documents joints</h2>
            <div className="file-upload-zone">
              <input
                type="file"
                id="files"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="files" className="file-upload-label">
                <span className="file-upload-icon">📎</span>
                <span className="file-upload-text">
                  {files.length > 0
                    ? `${files.length} fichier(s) sélectionné(s)`
                    : 'Cliquez pour ajouter des fichiers (PDF, JPG, PNG)'}
                </span>
                <span className="file-upload-hint">Taille max: 10 Mo par fichier</span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span>📄 {f.name}</span>
                    <span className="file-size">{(f.size / 1024).toFixed(1)} Ko</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="create-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Annuler</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Soumettre la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
