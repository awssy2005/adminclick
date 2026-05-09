import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './TrackingTimeline.css';

const STATUS_META = {
  soumise:       { icon: '📬', color: '#6366f1', label: { fr: 'Soumise',       ar: 'مُقدَّمة' } },
  en_traitement: { icon: '⚙️', color: '#f59e0b', label: { fr: 'En traitement', ar: 'قيد المعالجة' } },
  expediee:      { icon: '📦', color: '#3b82f6', label: { fr: 'Expédiée',      ar: 'تم الشحن' } },
  livree:        { icon: '✅', color: '#10b981', label: { fr: 'Livrée',        ar: 'تم التسليم' } },
  rejetee:       { icon: '❌', color: '#ef4444', label: { fr: 'Rejetée',       ar: 'مرفوضة' } },
};

const getStatusMeta = (status) =>
  STATUS_META[status] ?? { icon: '🔄', color: '#64748b', label: { fr: status, ar: status } };

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

export default function TrackingTimeline({ demandeId }) {
  const { lang, t } = useLanguage();
  const [events, setEvents]     = useState([]);
  const [trackCode, setTrackCode] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!demandeId) return;
    setLoading(true);
    api.get(`/demandes/${demandeId}/tracking`)
      .then(res => {
        setEvents(res.data.events ?? []);
        setTrackCode(res.data.tracking_code ?? null);
      })
      .catch(() => setError(t('تعذّر تحميل بيانات التتبع.', 'Impossible de charger le suivi.')))
      .finally(() => setLoading(false));
  }, [demandeId]);

  if (loading) {
    return (
      <div className="ttl-loading">
        <span className="ttl-spinner" />
      </div>
    );
  }

  return (
    <div className="ttl-wrap">
      <div className="ttl-header">
        <h3>🚚 {t('تتبع الطلب', 'Suivi de la commande')}</h3>
        {trackCode && (
          <a
            className="ttl-track-link"
            href={`https://www.barid.ma/fr/suivi-de-colis?ref=${trackCode}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 {t('تتبع على موقع بريد المغرب', 'Suivre sur Barid Al-Maghrib')}
            <span className="ttl-track-code">{trackCode}</span>
          </a>
        )}
      </div>

      {error && <p className="ttl-error">{error}</p>}

      {events.length === 0 && !error ? (
        <div className="ttl-empty">
          <span>📭</span>
          <p>{t('لا توجد أحداث تتبع حتى الآن.', 'Aucun événement de suivi pour le moment.')}</p>
        </div>
      ) : (
        <ol className="ttl-list">
          {events.map((ev, i) => {
            const meta = getStatusMeta(ev.status);
            return (
              <li key={ev.id} className={`ttl-item ${i === 0 ? 'latest' : ''}`}>
                {/* Spine */}
                <div className="ttl-spine">
                  <div className="ttl-dot" style={{ background: meta.color, boxShadow: `0 0 0 4px ${meta.color}22` }}>
                    {meta.icon}
                  </div>
                  {i < events.length - 1 && <div className="ttl-line" />}
                </div>

                {/* Content */}
                <div className="ttl-content">
                  <div className="ttl-status-row">
                    <span className="ttl-status-label" style={{ color: meta.color }}>
                      {lang === 'ar' ? meta.label.ar : meta.label.fr}
                    </span>
                    {i === 0 && <span className="ttl-badge-latest">{t('الأخير', 'Récent')}</span>}
                  </div>
                  <p className="ttl-description">{ev.description}</p>
                  {ev.location && (
                    <p className="ttl-location">📍 {ev.location}</p>
                  )}
                  <span className="ttl-date">{fmtDate(ev.created_at)}</span>
                  {ev.tracking_code && (
                    <span className="ttl-code">
                      {t('رمز التتبع', 'Code suivi')}: <code>{ev.tracking_code}</code>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
