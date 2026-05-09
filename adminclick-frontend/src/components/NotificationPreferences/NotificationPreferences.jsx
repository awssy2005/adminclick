import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './NotificationPreferences.css';

export default function NotificationPreferences() {
  const { t } = useLanguage();
  const [prefs, setPrefs]     = useState({ notif_email: true, notif_sms: false, notif_whatsapp: false, phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [err, setErr]         = useState('');

  useEffect(() => {
    api.get('/user/notification-preferences')
      .then(r => setPrefs({ notif_email: true, notif_sms: false, notif_whatsapp: false, phone: '', ...r.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(''); setErr('');
    try {
      await api.put('/user/notification-preferences', prefs);
      setMsg(t('تم حفظ التفضيلات بنجاح.', 'Préférences enregistrées avec succès.'));
      setTimeout(() => setMsg(''), 3500);
    } catch {
      setErr(t('خطأ أثناء الحفظ.', 'Erreur lors de la sauvegarde.'));
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  if (loading) return <div className="np-loading"><span className="np-spinner" /></div>;

  return (
    <div className="np-card">
      <h2 className="np-title">🔔 {t('تفضيلات الإشعارات', 'Préférences de notification')}</h2>
      <p className="np-subtitle">
        {t('اختر الطرق التي تريد تلقي الإشعارات عبرها.', 'Choisissez les canaux par lesquels vous souhaitez recevoir vos notifications.')}
      </p>

      {msg && <div className="np-msg np-ok">✅ {msg}</div>}
      {err && <div className="np-msg np-err">⚠️ {err}</div>}

      <form onSubmit={handleSubmit} className="np-form">
        {/* Channels */}
        <div className="np-channels">
          {/* Email */}
          <label className={`np-channel-card ${prefs.notif_email ? 'on' : ''}`}>
            <div className="np-channel-icon">📧</div>
            <div className="np-channel-info">
              <span className="np-channel-name">{t('البريد الإلكتروني', 'Email')}</span>
              <span className="np-channel-hint">{t('يُرسل على عنوان بريدك الإلكتروني', 'Envoyé sur votre adresse email')}</span>
            </div>
            <div className="np-toggle-wrap">
              <input
                type="checkbox"
                id="pref-email"
                className="np-toggle-input"
                checked={prefs.notif_email}
                onChange={() => toggle('notif_email')}
              />
              <label htmlFor="pref-email" className="np-toggle" />
            </div>
          </label>

          {/* SMS */}
          <label className={`np-channel-card ${prefs.notif_sms ? 'on' : ''}`}>
            <div className="np-channel-icon">💬</div>
            <div className="np-channel-info">
              <span className="np-channel-name">SMS</span>
              <span className="np-channel-hint">{t('رسالة قصيرة على رقم هاتفك', 'SMS sur votre numéro de téléphone')}</span>
            </div>
            <div className="np-toggle-wrap">
              <input
                type="checkbox"
                id="pref-sms"
                className="np-toggle-input"
                checked={prefs.notif_sms}
                onChange={() => toggle('notif_sms')}
              />
              <label htmlFor="pref-sms" className="np-toggle" />
            </div>
          </label>

          {/* WhatsApp */}
          <label className={`np-channel-card ${prefs.notif_whatsapp ? 'on' : ''}`}>
            <div className="np-channel-icon">📱</div>
            <div className="np-channel-info">
              <span className="np-channel-name">WhatsApp</span>
              <span className="np-channel-hint">{t('رسالة واتساب على رقمك', 'Message WhatsApp sur votre numéro')}</span>
            </div>
            <div className="np-toggle-wrap">
              <input
                type="checkbox"
                id="pref-wa"
                className="np-toggle-input"
                checked={prefs.notif_whatsapp}
                onChange={() => toggle('notif_whatsapp')}
              />
              <label htmlFor="pref-wa" className="np-toggle" />
            </div>
          </label>
        </div>

        {/* Phone number (shown if SMS or WA is on) */}
        {(prefs.notif_sms || prefs.notif_whatsapp) && (
          <div className="np-phone-group">
            <label className="np-phone-label">📞 {t('رقم الهاتف', 'Numéro de téléphone')}</label>
            <input
              type="tel"
              className="np-phone-input"
              placeholder="+212 6XX XXX XXX"
              value={prefs.phone ?? ''}
              onChange={e => setPrefs(p => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary np-save-btn" disabled={saving}>
          {saving ? <><span className="np-spinner" /> {t('جارٍ الحفظ...', 'Sauvegarde...')}</> : t('حفظ التفضيلات', 'Enregistrer mes préférences')}
        </button>
      </form>
    </div>
  );
}
