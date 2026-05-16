import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ActeNaissanceWizard from './ActeNaissanceWizard'; // ← Votre nouveau wizard
import { useLanguage } from '../../context/LanguageContext';
import './CreateDemande.css';
import DiagnosticAssistant from '../../components/Diagnostic/DiagnosticAssistant';

export default function CreateDemande() {
  const [type, setType] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage(); // ← plus besoin de lang

  const serviceTypes = [
    { id: 'acte_naissance', nameKey: 'birth_certificate', icon: '👶', descKey: 'birth_cert_desc', useWizard: true },
    { id: 'certificat_residence', nameKey: 'residence_cert', icon: '🏠', descKey: 'residence_cert_desc', useWizard: false },
    { id: 'carte_nationale', nameKey: 'national_id', icon: '🪪', descKey: 'national_id_desc', useWizard: false },
    { id: 'extrait_casier', nameKey: 'criminal_record', icon: '⚖️', descKey: 'criminal_record_desc', useWizard: false },
    { id: 'attestation_travail', nameKey: 'work_cert', icon: '💼', descKey: 'work_cert_desc', useWizard: false },
  ];

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleServiceSelect = (service) => {
    setType(service.id);
    setShowWizard(service.useWizard);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) {
      setError(t('select_service_required'));
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
      setSuccess(t('demande_submitted', { id: res.data.id }));
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('submission_error'));
    } finally {
      setLoading(false);
    }
  };

  // Affichage du wizard pour l'acte de naissance
  if (showWizard) {
    return (
      <div className="create-demande">
        <div className="container">
          <div className="create-header animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
            <button
              className="btn btn-secondary"
              style={{ marginBottom: '1rem' }}
              onClick={() => { setShowWizard(false); setType(''); }}
            >
              ← {t('back_to_service_selection')}
            </button>
          </div>
          <ActeNaissanceWizard onCancel={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  // Formulaire classique pour les autres documents
  return (
    <div className="create-demande">
      <div className="container">
        <div className="create-header animate-fade-in-up">
          <h1 className="create-title">📝 {t('new_request')}</h1>
          <p className="create-subtitle">{t('new_request_subtitle')}</p>
          <div className="create-helper-banner animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="helper-text">
              <span className="helper-icon">💡</span>
              <span>{t('complex_case_prompt')}</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAssistant(true)}
            >
              {t('diagnostic_assistant')}
            </button>
          </div>
        </div>

        {showAssistant && <DiagnosticAssistant onClose={() => setShowAssistant(false)} />}

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
          {/* Sélection du type de document */}
          <div className="form-section">
            <h2 className="form-section-title">{t('document_type')}</h2>
            <div className="service-select-grid">
              {serviceTypes.map((s) => (
                <label
                  key={s.id}
                  className={`service-select-card ${type === s.id ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(s)}
                >
                  <input
                    type="radio"
                    name="type"
                    value={s.id}
                    checked={type === s.id}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <span className="service-select-icon">{s.icon}</span>
                  <span className="service-select-name">{t(s.nameKey)}</span>
                  <span className="service-select-desc">{t(s.descKey)}</span>
                  {s.useWizard && (
                    <span className="service-adminclick-badge">🧾 AdminClick</span>
                  )}
                  {type === s.id && <span className="service-select-check">✓</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Description (optionnel) */}
          <div className="form-section">
            <h2 className="form-section-title">{t('additional_info')}</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                {t('description_optional')}
              </label>
              <textarea
                id="description"
                className="form-input form-textarea"
                placeholder={t('description_placeholder')}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Upload de fichiers */}
          <div className="form-section">
            <h2 className="form-section-title">{t('attached_documents')}</h2>
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
                    ? `${files.length} ${t('files_selected')}`
                    : t('click_to_add_files')}
                </span>
                <span className="file-upload-hint">{t('max_file_size')}</span>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                t('submit_request')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}