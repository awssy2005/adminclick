import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './DocumentVault.css';

const TYPE_LABELS = {
  acte_naissance:      { fr: 'Acte de Naissance',   ar: 'رسم الولادة' },
  certificat_residence:{ fr: 'Certificat de Résidence', ar: 'شهادة السكنى' },
  carte_nationale:     { fr: "Carte Nationale",      ar: 'البطاقة الوطنية' },
  extrait_casier:      { fr: 'Extrait de Casier',    ar: 'السجل العدلي' },
  attestation_travail: { fr: 'Attestation de Travail', ar: 'شهادة العمل' },
  autre:               { fr: 'Autre',                ar: 'أخرى' },
};

const MIME_ICON = (mimeType = '') => {
  if (mimeType.includes('pdf'))  return '📄';
  if (mimeType.includes('image')) return '🖼️';
  return '📎';
};

const fmtSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── Share Popup ──────────────────────────────────────────────────────────────
function SharePopup({ url, expiresAt, onClose, t }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="vault-overlay" onClick={onClose}>
      <div className="vault-popup animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="vault-popup-close" onClick={onClose}>×</button>
        <div className="vault-popup-icon">🔗</div>
        <h3>{t('رابط المشاركة المؤقت', 'Lien de partage temporaire')}</h3>
        <p className="vault-popup-hint">
          {t('صالح لمدة 24 ساعة', 'Valable 24 heures')} —{' '}
          {t('ينتهي في', 'Expire le')} {fmtDate(expiresAt)}
        </p>
        <div className="vault-share-url">
          <input readOnly value={url} onClick={(e) => e.target.select()} />
          <button className="vault-copy-btn" onClick={copy}>
            {copied ? '✓' : '📋'}
          </button>
        </div>
        {copied && <p className="vault-copied-msg">{t('تم النسخ!', 'Copié !')}</p>}
      </div>
    </div>
  );
}

// ── Delete Confirm Popup ─────────────────────────────────────────────────────
function DeletePopup({ doc, onConfirm, onClose, t, loading }) {
  return (
    <div className="vault-overlay" onClick={onClose}>
      <div className="vault-popup vault-popup-delete animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="vault-popup-icon">⚠️</div>
        <h3>{t('تأكيد الحذف', 'Confirmer la suppression')}</h3>
        <p>{t('سيتم حذف هذا الملف نهائياً ولن يمكن استعادته.', 'Ce fichier sera supprimé définitivement et ne pourra pas être récupéré.')}</p>
        <strong style={{ wordBreak: 'break-all' }}>{doc.name}</strong>
        <div className="vault-popup-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {t('إلغاء', 'Annuler')}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="vault-spinner" /> : t('حذف', 'Supprimer')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DocumentVault() {
  const { t, lang } = useLanguage();
  const fileInputRef = useRef();

  const [documents, setDocuments]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterType, setFilterType]   = useState('');
  const [uploading, setUploading]     = useState(false);
  const [uploadType, setUploadType]   = useState('autre');
  const [shareData, setShareData]     = useState(null);   // { url, expiresAt }
  const [deleteTarget, setDeleteTarget] = useState(null); // doc object
  const [deleting, setDeleting]       = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const params = filterType ? { type: filterType } : {};
      const res = await api.get('/documents', { params });
      setDocuments(res.data);
    } catch {
      setError(t('خطأ في تحميل المستندات.', 'Erreur lors du chargement des documents.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, [filterType]);

  // ── Upload ──
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('type', uploadType);
    try {
      await api.post('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(t('تم رفع الملف بنجاح.', 'Fichier téléversé avec succès.'));
      setTimeout(() => setSuccess(''), 3000);
      fetchDocs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('خطأ أثناء رفع الملف.', 'Erreur lors du téléversement.')
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Download ──
  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href     = url;
      a.download = doc.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError(t('تعذّر تحميل الملف.', 'Impossible de télécharger le fichier.'));
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/documents/${deleteTarget.id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setSuccess(t('تم حذف الوثيقة.', 'Document supprimé.'));
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError(t('خطأ أثناء الحذف.', 'Erreur lors de la suppression.'));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Share ──
  const handleShare = async (doc) => {
    try {
      const res = await api.post(`/documents/${doc.id}/share`);
      setShareData({ url: res.data.share_url, expiresAt: res.data.expires_at });
    } catch {
      setError(t('خطأ في توليد رابط المشاركة.', 'Erreur lors de la génération du lien.'));
    }
  };

  const typeLabel = (type) => {
    const entry = TYPE_LABELS[type] || TYPE_LABELS['autre'];
    return lang === 'ar' ? entry.ar : entry.fr;
  };

  return (
    <div className="vault-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="vault-header animate-fade-in-up">
          <div>
            <h1 className="vault-title">🗄️ {t('الخزينة الرقمية', 'Coffre-fort numérique')}</h1>
            <p className="vault-subtitle">
              {t('خزّن وثائقك الإدارية بأمان وشاركها بسهولة.', 'Stockez et partagez vos documents administratifs en toute sécurité.')}
            </p>
          </div>

          {/* Upload zone */}
          <div className="vault-upload-zone">
            <select
              className="vault-type-select"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              disabled={uploading}
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{lang === 'ar' ? v.ar : v.fr}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading
                ? <><span className="vault-spinner" /> {t('جارٍ الرفع...', 'Téléversement...')}</>
                : <>📤 {t('إضافة وثيقة', 'Ajouter un document')}</>
              }
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* ── Feedback ── */}
        {success && <div className="vault-msg vault-msg-ok animate-fade-in-up">✅ {success}</div>}
        {error   && <div className="vault-msg vault-msg-err animate-fade-in-up">⚠️ {error}</div>}

        {/* ── Filter bar ── */}
        <div className="vault-filter-bar animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <span className="vault-filter-label">{t('تصفية:', 'Filtrer :')}</span>
          {['', ...Object.keys(TYPE_LABELS)].map((k) => (
            <button
              key={k || 'all'}
              className={`vault-filter-chip ${filterType === k ? 'active' : ''}`}
              onClick={() => setFilterType(k)}
            >
              {k === '' ? t('الكل', 'Tous') : typeLabel(k)}
            </button>
          ))}
        </div>

        {/* ── Documents grid ── */}
        {loading ? (
          <div className="vault-loading"><span className="spinner" /></div>
        ) : documents.length === 0 ? (
          <div className="vault-empty animate-fade-in-up">
            <div className="vault-empty-icon">📂</div>
            <p>{t('لا توجد وثائق في خزينتك بعد.', 'Votre coffre-fort est vide pour l\'instant.')}</p>
            <p className="vault-empty-hint">
              {t('انقر على « إضافة وثيقة » لرفع أول ملف.', 'Cliquez sur « Ajouter un document » pour commencer.')}
            </p>
          </div>
        ) : (
          <div className="vault-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {documents.map((doc) => (
              <div key={doc.id} className="vault-card">
                <div className="vault-card-top">
                  <div className="vault-doc-icon">{MIME_ICON(doc.file_type)}</div>
                  <div className="vault-doc-info">
                    <span className="vault-doc-name" title={doc.name}>{doc.name}</span>
                    <span className="vault-doc-type">{typeLabel(doc.type)}</span>
                  </div>
                  {doc.share_active && (
                    <span className="vault-share-badge" title={t('رابط مشاركة نشط', 'Lien de partage actif')}>🔗</span>
                  )}
                </div>
                <div className="vault-card-meta">
                  <span>📅 {fmtDate(doc.created_at)}</span>
                  <span>💾 {fmtSize(doc.size)}</span>
                </div>
                <div className="vault-card-actions">
                  <button
                    className="vault-action-btn vault-btn-download"
                    title={t('تحميل', 'Télécharger')}
                    onClick={() => handleDownload(doc)}
                  >
                    ⬇️ {t('تحميل', 'Télécharger')}
                  </button>
                  <button
                    className="vault-action-btn vault-btn-share"
                    title={t('مشاركة', 'Partager')}
                    onClick={() => handleShare(doc)}
                  >
                    🔗 {t('مشاركة', 'Partager')}
                  </button>
                  <button
                    className="vault-action-btn vault-btn-delete"
                    title={t('حذف', 'Supprimer')}
                    onClick={() => setDeleteTarget(doc)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Popups ── */}
      {shareData && (
        <SharePopup
          url={shareData.url}
          expiresAt={shareData.expiresAt}
          onClose={() => setShareData(null)}
          t={t}
        />
      )}
      {deleteTarget && (
        <DeletePopup
          doc={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          t={t}
          loading={deleting}
        />
      )}
    </div>
  );
}
