import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './CnieFetcher.css';

/**
 * CnieFetcher
 * -----------
 * Props:
 *   onPrefill(data) — called on success with { nom_ar, prenom_ar, nom_fr,
 *                     prenom_fr, date_naissance, lieu_naissance }
 */
export default function CnieFetcher({ onPrefill }) {
  const { lang, t } = useLanguage();

  const [cnie, setCnie]     = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'
  const [errMsg, setErrMsg] = useState('');

  const isValidFormat = /^[A-Za-z]{1,2}\d{5,6}$/.test(cnie.trim());

  const handleVerify = async () => {
    if (!isValidFormat) {
      setStatus('error');
      setErrMsg(t(
        'صيغة الرقم غير صحيحة. مثال: BK123456',
        'Format incorrect. Exemple : BK123456'
      ));
      return;
    }

    setStatus('loading');
    setErrMsg('');

    try {
      const res = await api.post('/cnie/fetch', { cnie: cnie.trim().toUpperCase() });
      setStatus('ok');
      onPrefill(res.data);
    } catch (err) {
      setStatus('error');
      if (err.response?.status === 404) {
        const body = err.response.data;
        // Server returns { fr: '...', ar: '...' }
        setErrMsg(lang === 'ar' ? body.ar : body.fr);
      } else if (err.response?.status === 422) {
        setErrMsg(t(
          'الرقم المدخل غير صالح.',
          'Le numéro saisi est invalide.'
        ));
      } else {
        setErrMsg(t(
          'خطأ في الاتصال بالخادم. حاول مجددًا.',
          'Erreur de connexion au serveur. Réessayez.'
        ));
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className={`cnie-fetcher ${status}`}>
      {/* ── Label ── */}
      <label className="cnie-fetcher__label">
        <span className="cnie-fetcher__icon">🪪</span>
        <span className="cnie-fetcher__label-ar">رقم البطاقة الوطنية للتعريف الإلكترونية (CNIE)</span>
        <span className="cnie-fetcher__sep"> / </span>
        <span className="cnie-fetcher__label-fr">Pré-remplir via le numéro CNIE</span>
      </label>

      {/* ── Input row ── */}
      <div className="cnie-fetcher__row">
        <input
          className={`cnie-fetcher__input ${status === 'error' ? 'err' : ''} ${status === 'ok' ? 'ok' : ''}`}
          type="text"
          placeholder={t('مثال: BK123456', 'Ex : BK123456')}
          value={cnie}
          maxLength={8}
          onChange={(e) => {
            setCnie(e.target.value.toUpperCase());
            if (status !== 'idle') setStatus('idle');
          }}
          onKeyDown={handleKeyDown}
          disabled={status === 'loading'}
          autoComplete="off"
        />
        <button
          type="button"
          className="cnie-fetcher__btn"
          onClick={handleVerify}
          disabled={status === 'loading' || !cnie.trim()}
        >
          {status === 'loading' ? (
            <span className="cnie-fetcher__spinner" />
          ) : (
            t('تحقق وملء تلقائي ✦', 'Vérifier et pré-remplir ✦')
          )}
        </button>
      </div>

      {/* ── Feedback messages ── */}
      {status === 'error' && (
        <div className="cnie-fetcher__msg cnie-fetcher__msg--error">
          ⚠️ {errMsg}
        </div>
      )}
      {status === 'ok' && (
        <div className="cnie-fetcher__msg cnie-fetcher__msg--ok">
          ✅ {t(
            'تم التعرف على هويتك وتم ملء الحقول تلقائياً. يمكنك التعديل إن لزم.',
            'Identité reconnue. Les champs ont été pré-remplis — vous pouvez les modifier si nécessaire.'
          )}
        </div>
      )}

      {/* ── Hint ── */}
      {status === 'idle' && (
        <p className="cnie-fetcher__hint">
          {t(
            '💡 أدخل رقم بطاقتك الوطنية لتسريع تعبئة النموذج.',
            '💡 Saisissez votre numéro CNIE pour pré-remplir automatiquement le formulaire.'
          )}
        </p>
      )}
    </div>
  );
}
