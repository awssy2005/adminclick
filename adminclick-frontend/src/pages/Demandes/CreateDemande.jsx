import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminClickWizard from './AdminClickWizard';
import { useLanguage } from '../../context/LanguageContext';
import './CreateDemande.css';
import DiagnosticAssistant from '../../components/Diagnostic/DiagnosticAssistant';

export default function CreateDemande() {
  const [type, setType] = useState('');
  const [showAdminClickWizard, setShowAdminClickWizard] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const serviceTypes = [
    { id: 'acte_naissance', name: t('رسم الولادة', 'Acte de Naissance'), icon: '👶', desc: t('نسخة كاملة أو موجزة', 'Copie intégrale ou extrait'), adminClick: true },
    { id: 'certificat_residence', name: t('شهادة السكنى', 'Certificat de Résidence'), icon: '🏠', desc: t('إثبات السكن', 'Attestation de domicile') },
    { id: 'carte_nationale', name: t('البطاقة الوطنية', "Carte Nationale d'Identité"), icon: '🪪', desc: t('إنشاء أو تجديد', 'Création ou renouvellement') },
    { id: 'extrait_casier', name: t('السجل العدلي', 'Extrait de Casier Judiciaire'), icon: '⚖️', desc: t('بطاقة رقم 3', 'Bulletin n°3') },
    { id: 'attestation_travail', name: t('شهادة العمل', 'Attestation de Travail'), icon: '💼', desc: t('شهادة المشغل', 'Certificat employeur') },
  ];

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleServiceSelect = (s) => {
    setType(s.id);
    if (s.adminClick) {
      setShowAdminClickWizard(true);
    } else {
      setShowAdminClickWizard(false);
    }
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

  // ── If acte de naissance is selected → show AdminClick wizard ──
  if (showAdminClickWizard) {
    return (
      <div className="create-demande">
        <div className="container">
          <div className="create-header animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
            <button
              className="btn btn-secondary"
              style={{ marginBottom: '1rem' }}
              onClick={() => { setShowAdminClickWizard(false); setType(''); }}
            >
              ← {t('العودة لاختيار الخدمة', 'Retour au choix du service')}
            </button>
          </div>
          <AdminClickWizard onCancel={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  // ── Default create form for other document types ──
  return (
    <div className="create-demande">
      <div className="container">
        <div className="create-header animate-fade-in-up">
          <h1 className="create-title">📝 {t('طلب جديد', 'Nouvelle demande')}</h1>
          <p className="create-subtitle">{t('اختر نوع الوثيقة واملأ الاستمارة', 'Sélectionnez le type de document et remplissez le formulaire')}</p>
          <div className="create-helper-banner animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="helper-text">
              <span className="helper-icon">💡</span>
              <span>{t('لديك حالة خاصة أو مشكلة؟', 'Vous avez un cas complexe ou un problème ?')}</span>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAssistant(true)}
            >
              {t('مساعد التشخيص الذكي', 'Assistant de diagnostic intelligent')}
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
          {/* Service type selection */}
          <div className="form-section">
            <h2 className="form-section-title">{t('نوع الوثيقة', 'Type de document')}</h2>
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
                    onChange={() => { }}
                    className="sr-only"
                  />
                  <span className="service-select-icon">{s.icon}</span>
                  <span className="service-select-name">{s.name}</span>
                  <span className="service-select-desc">{s.desc}</span>
                  {s.adminClick && (
                    <span className="service-adminclick-badge">🧾 AdminClick</span>
                  )}
                  {type === s.id && <span className="service-select-check">✓</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2 className="form-section-title">{t('معلومات إضافية', 'Informations complémentaires')}</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="description">{t('وصف (اختياري)', 'Description (optionnel)')}</label>
              <textarea
                id="description"
                className="form-input form-textarea"
                placeholder={t('أضف تفاصيل أو توضيحات حول طلبك...', 'Ajoutez des détails ou précisions sur votre demande...')}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* File upload */}
          <div className="form-section">
            <h2 className="form-section-title">{t('الوثائق المرفقة', 'Documents joints')}</h2>
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
                    ? `${files.length} ${t('ملفات مختارة', 'fichier(s) sélectionné(s)')}`
                    : t('انقر لإضافة ملفات (PDF, JPG, PNG)', 'Cliquez pour ajouter des fichiers (PDF, JPG, PNG)')}
                </span>
                <span className="file-upload-hint">{t('الحجم الأقصى: 10 ميجا بايت لكل ملف', 'Taille max: 10 Mo par fichier')}</span>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>{t('إلغاء', 'Annuler')}</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : t('إرسال الطلب', 'Soumettre la demande')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
