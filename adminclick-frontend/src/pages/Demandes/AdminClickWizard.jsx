import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './AdminClickWizard.css';

const STEPS = ['accueil', 'titulaire', 'demandeur', 'livraison', 'recapitulatif', 'paiement', 'confirmation'];

function generateOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `ADC-2026-${n}`;
}

// ── Validation helpers ──
const ERRORS = {
  nomAr:   { ar: 'يرجى إدخال الاسم بالعربية', fr: 'Veuillez saisir le nom en arabe' },
  nomFr:   { ar: 'يرجى إدخال الاسم بالفرنسية', fr: 'Veuillez saisir le nom en français' },
  date:    { ar: 'تاريخ الميلاد غير صالح أو مستقبلي', fr: 'Date de naissance invalide ou future' },
  lieu:    { ar: 'يرجى تحديد مكان الازدياد', fr: 'Veuillez indiquer le lieu de naissance' },
  cnie:    { ar: 'صيغة البطاقة الوطنية غير صحيحة (مثال: BK123456)', fr: 'Format CIN invalide (ex: BK123456)' },
  lien:    { ar: 'يرجى اختيار صلة القرابة', fr: 'Veuillez choisir votre lien de parenté' },
  nomDem:  { ar: 'يرجى إدخال الاسم الكامل للطالب', fr: 'Veuillez saisir le nom complet du demandeur' },
  adresse: { ar: 'يرجى إدخال العنوان الكامل', fr: 'Veuillez saisir l\'adresse complète' },
  tel:     { ar: 'رقم الهاتف غير صالح (مثال: 0612345678)', fr: 'Numéro invalide (ex: 0612345678 ou +212...)' },
  email:   { ar: 'البريد الإلكتروني غير صالح', fr: 'Adresse e-mail invalide' },
  numActe: { ar: 'رقم الحالة المدنية مطلوب', fr: 'Le numéro d\'acte est requis' },
  anneeActe: { ar: 'سنة الحالة المدنية مطلوبة', fr: 'L\'année de l\'acte est requise' },
  region:  { ar: 'يرجى اختيار الجهة', fr: 'Veuillez choisir la région' },
  province: { ar: 'يرجى اختيار الإقليم', fr: 'Veuillez choisir la province' },
  carte:   { ar: 'رقم البطاقة يجب أن يكون 16 رقمًا', fr: 'Le numéro de carte doit comporter 16 chiffres' },
  expiry:  { ar: 'تاريخ الانتهاء غير صالح (مثال: 12/27)', fr: 'Date d\'expiration invalide (ex: 12/27)' },
  cvv:     { ar: 'رمز CVV يجب أن يكون 3 أرقام', fr: 'Le CVV doit comporter 3 chiffres' },
};

function isArabic(str) { return /[\u0600-\u06FF]/.test(str) && str.trim().length >= 3; }
function isValidTel(t) { return /^(\+212|0)([ -]?\d){9}$/.test(t.replace(/\s/g,'')); }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidCnie(c) { return c === '' || /^[A-Za-z]{1,2}\d{5,6}$/.test(c); }
function isValidDate(d) { if (!d) return false; const dt = new Date(d); return dt < new Date() && dt.getFullYear() > 1900; }
function isValidExpiry(e) { if (!/^\d{2}\/\d{2}$/.test(e)) return false; const [m,y] = e.split('/').map(Number); const now = new Date(); return m>=1&&m<=12&&(y+2000>now.getFullYear()||(y+2000===now.getFullYear()&&m>=now.getMonth()+1)); }

function ErrorMsg({ err, lang }) {
  if (!err) return null;
  const msg = lang === 'ar' ? err.ar : err.fr;
  return <div className="wq-error">{msg}</div>;
}

// ── Arabic Virtual Keyboard ──
const AR_ROWS = [
  ['\u0636','\u0635','\u062b','\u0642','\u0641','\u063a','\u0639','\u0647','\u062e','\u062d','\u062c','\u062f'],
  ['\u0634','\u0633','\u064a','\u0628','\u0644','\u0627','\u062a','\u0646','\u0645','\u0643','\u0637'],
  ['\u0626','\u0621','\u0624','\u0631','\u0644\u0627','\u0649','\u0629','\u0648','\u0632','\u0638'],
];

function VirtualKeyboard({ value, onChange, onConfirm, label }) {
  const press = (ch) => onChange(value + ch);
  const del   = () => onChange(value.slice(0, -1));
  const space = () => onChange(value + ' ');
  return (
    <div className="wq-vkb">
      <div className="wq-vkb-label">{label}</div>
      <div className="wq-vkb-display" dir="rtl">{value || <span className="wq-vkb-ph">...</span>}</div>
      <div className="wq-vkb-rows">
        {AR_ROWS.map((row, ri) => (
          <div key={ri} className="wq-vkb-row">
            {row.map(ch => (
              <button key={ch} type="button" className="wq-vkb-key" onClick={() => press(ch)}>{ch}</button>
            ))}
          </div>
        ))}
        <div className="wq-vkb-row wq-vkb-row-ctrl">
          <button type="button" className="wq-vkb-key wq-vkb-del" onClick={del}>مسح</button>
          <button type="button" className="wq-vkb-key wq-vkb-space" onClick={space}>فراغ</button>
          <button type="button" className="wq-vkb-key wq-vkb-ok" onClick={onConfirm} disabled={!value.trim()}>تم ✓</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminClickWizard({ onCancel }) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState('accueil');
  const [orderNumber] = useState(generateOrderNumber());

  // ── Keyboard state for nomAr field ──
  const [kbNomAr, setKbNomAr] = useState('');
  const [showKb, setShowKb] = useState(false);

  // ── Titulaire ──
  const [nomAr, setNomAr] = useState('');
  const [nomFr, setNomFr] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [lieuNaissance, setLieuNaissance] = useState('');
  const [cnie, setCnie] = useState('');
  const [numeroActe, setNumeroActe] = useState('');
  const [anneeActe, setAnneeActe] = useState('');

  // ── Demandeur ──
  const [lienParente, setLienParente] = useState('');
  const [autreParente, setAutreParente] = useState('');
  const [nomDemandeur, setNomDemandeur] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');

  // ── CNIE prefill ──
  const [cnieLoading, setCnieLoading]   = useState(false);
  const [cniePrefilled, setCniePrefilled] = useState(false);
  const [cnieError, setCnieError]       = useState('');

  // ── Commune API autocomplete & Hierarchy ──
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommuneId, setSelectedCommuneId] = useState('');

  const [villeSuggestions, setVilleSuggestions] = useState([]);
  const [villeLoading, setVilleLoading]         = useState(false);
  const [selectedCommune, setSelectedCommune]   = useState(null); // full commune object
  const [bec, setBec]                           = useState(''); // Bureau d'Etat Civil / Moqata'a
  const [becSuggestions, setBecSuggestions]     = useState([]);
  const [deliveryAgency, setDeliveryAgency]     = useState('');

  const villeRef     = useRef(null);
  const debounceRef  = useRef(null);

  // Load Regions on mount
  useEffect(() => {
    api.get('/regions').then(res => setRegions(res.data));
  }, []);

  // Load Provinces when region changes
  useEffect(() => {
    if (selectedRegion) {
      api.get(`/provinces/${selectedRegion}`).then(res => {
        setProvinces(res.data);
        setCommunes([]);
        setSelectedProvince('');
        setSelectedCommuneId('');
      });
    }
  }, [selectedRegion]);

  // Load Communes when province changes
  useEffect(() => {
    if (selectedProvince) {
      api.get(`/communes/${selectedProvince}`).then(res => setCommunes(res.data));
    }
  }, [selectedProvince]);

  // ── Submit state ──
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [realOrderId, setRealOrderId]    = useState(null);

  // ── Paiement simulé ──
  const [carte, setCarte] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [payLoading, setPayLoading] = useState(false);

  // ── Validation touched state ──
  const [touched, setTouched] = useState({});
  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  // ── Auto-open keyboard when Arabic mode reaches titulaire ──
  useEffect(() => {
    if (step === 'titulaire' && lang === 'ar' && !nomAr) {
      setShowKb(true);
    }
  }, [step, lang, nomAr]);

  const lienOptions = [
    { value: 'moi', ar: 'بنفسي', fr: 'Moi-même' },
    { value: 'pere', ar: 'الأب', fr: 'Père' },
    { value: 'mere', ar: 'الأم', fr: 'Mère' },
    { value: 'tuteur', ar: 'الوصي', fr: 'Tuteur' },
    { value: 'autre', ar: 'غير ذلك', fr: 'Autre' },
  ];

  // Computed errors
  const errs = {
    nomAr:   !isArabic(nomAr)   ? ERRORS.nomAr   : null,
    nomFr:   nomFr.trim().length < 3 ? ERRORS.nomFr : null,
    date:    !isValidDate(dateNaissance) ? ERRORS.date : null,
    lieu:    lieuNaissance.trim().length < 2 ? ERRORS.lieu : null,
    cnie:    !isValidCnie(cnie)  ? ERRORS.cnie    : null,
    numActe: !numeroActe ? ERRORS.numActe : null,
    anneeActe: !anneeActe || anneeActe.length < 4 ? ERRORS.anneeActe : null,
    region:  !selectedRegion ? ERRORS.region : null,
    province: !selectedProvince ? ERRORS.province : null,
    lien:    !lienParente        ? ERRORS.lien    : null,
    nomDem:  nomDemandeur.trim().length < 3 ? ERRORS.nomDem : null,
    adresse: adresse.trim().length < 5 ? ERRORS.adresse : null,
    tel:     !isValidTel(telephone) ? ERRORS.tel  : null,
    email:   !isValidEmail(email)   ? ERRORS.email : null,
    carte:   carte.replace(/\s/g,'').length !== 16 ? ERRORS.carte : null,
    expiry:  !isValidExpiry(expiry)  ? ERRORS.expiry : null,
    cvv:     !/^\d{3}$/.test(cvv)    ? ERRORS.cvv : null,
  };

  const step1Valid = !errs.nomAr && !errs.nomFr && !errs.date && !errs.numActe && !errs.anneeActe && !errs.region && !errs.province && (selectedCommuneId ? !!bec : true);
  const step2Valid = !errs.lien && !errs.nomDem && !errs.adresse && !errs.tel && !errs.email
    && (lienParente !== 'autre' || autreParente.trim().length > 0);
  const payValid   = !errs.carte && !errs.expiry && !errs.cvv;

  const handleStep1 = () => {
    setTouched(t => ({ ...t, nomAr:true, nomFr:true, date:true, lieu:true, cnie:true }));
    if (step1Valid) setStep('demandeur');
  };
  const handleStep2 = () => {
    setTouched(t => ({ ...t, lien:true, nomDem:true, adresse:true, tel:true, email:true }));
    if (step2Valid) setStep('livraison');
  };

  // ── CNIE fetch from real API ──
  const handleCnieFetch = async () => {
    if (!cnie.trim()) return;
    setCnieLoading(true); setCnieError('');
    try {
      const res = await api.post('/cnie/fetch', { cnie: cnie.trim().toUpperCase() });
      const d = res.data;
      setNomAr(`${d.prenom_ar} ${d.nom_ar}`.trim());
      setNomFr(`${d.prenom_fr} ${d.nom_fr}`.trim());
      if (d.date_naissance) setDateNaissance(d.date_naissance);
      if (d.lieu_naissance) setLieuNaissance(d.lieu_naissance);
      setCniePrefilled(true);
      setTouched(t => ({ ...t, nomAr:true, nomFr:true, date:true, lieu:true }));
    } catch (err) {
      const body = err.response?.data;
      setCnieError(lang === 'ar' ? (body?.ar || 'خطأ في الاتصال') : (body?.fr || 'Erreur de connexion'));
    } finally {
      setCnieLoading(false);
    }
  };

  // ── City autocomplete → real API call with 400ms debounce ──
  const handleVilleChange = (val) => {
    setLieuNaissance(val);
    setSelectedCommune(null);
    clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setVilleSuggestions([]);
      return;
    }

    setVilleLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get('/communes', { params: { q: val } });
        setVilleSuggestions(res.data ?? []);
      } catch {
        setVilleSuggestions([]);
      } finally {
        setVilleLoading(false);
      }
    }, 400);
  };

  const selectCommune = (commune) => {
    setLieuNaissance(commune.display);
    setSelectedCommune(commune);
    setVilleSuggestions([]);
    
    // Générer des bureaux d'état civil probables pour cette commune
    const names = lang === 'ar' 
      ? ['مكتب الحالة المدنية المركزي', 'ملحقة إدارية رقم 1', 'ملحقة إدارية رقم 2', 'قيادة المنطقة']
      : ['Bureau d\'État Civil Central', 'Annexe Administrative n°1', 'Annexe Administrative n°2', 'Caïdat'];
    
    const suggested = names.map((name, i) => ({
      id: i,
      name: `${name} - ${commune.nom}`
    }));
    setBecSuggestions(suggested);
    setBec(''); // Reset BEC selection
    touch('lieu');
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setTouched(t => ({ ...t, carte:true, expiry:true, cvv:true }));
    if (!payValid) return;
    setPayLoading(true); setSubmitError('');
    try {
      // Simulate payment delay then submit to real API
      await new Promise(r => setTimeout(r, 1800));
      const res = await api.post('/demandes', {
        type: 'acte_naissance',
        description: [
          `N° Acte: ${numeroActe} / Année: ${anneeActe}`,
          `Titulaire: ${nomFr} / ${nomAr}`,
          `Né(e) le: ${dateNaissance}`,
          `Lieu: ${lieuNaissance} (Region ID: ${selectedRegion}, Prov ID: ${selectedProvince})`,
          `Bureau BEC: ${bec}`,
          `CNIE: ${cnie || 'N/A'}`,
          `Demandeur: ${nomDemandeur} (${getLienLabel()})`,
          `Tél: ${telephone} | Email: ${email}`,
          `Livraison: Barid Al-Maghrib — 30 DH | Agence: ${deliveryAgency}`,
        ].join(' | '),
      });
      setRealOrderId(res.data.id);
      setStep('confirmation');
    } catch {
      setSubmitError(t('حدث خطأ أثناء الإرسال. حاول مجدداً.', 'Erreur lors de la soumission. Veuillez réessayer.'));
    } finally {
      setPayLoading(false);
    }
  };

  // Format helpers
  const fmtCarte = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExpiry = (v) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d; };
  const fmtDate = (d) => { if (!d) return ''; const dt = new Date(d); return dt.toLocaleDateString('fr-MA', {day:'2-digit',month:'long',year:'numeric'}); };

  const getLienLabel = () => {
    const opt = lienOptions.find(o => o.value === lienParente);
    if (!opt) return '';
    if (lienParente === 'autre') return autreParente || (lang === 'ar' ? 'غير ذلك' : 'Autre');
    return lang === 'ar' ? opt.ar : opt.fr;
  };

  // ───── RENDER ─────
  return (
    <div className="wq-wrapper">
      {/* Header */}
      <div className="wq-header">
        <div className="wq-logo">
          <span className="wq-logo-icon">🧾</span>
          <div>
            <div className="wq-logo-title">أدمين كليك</div>
            <div className="wq-logo-sub">AdminClick</div>
          </div>
        </div>
        <div className="wq-header-desc">
          {t('خدمة رسم الولادة الإلكترونية', 'Service acte de naissance en ligne')}
        </div>
      </div>

      {/* Stepper */}
      {step !== 'accueil' && (
        <div className="wq-stepper">
          {['titulaire','demandeur','livraison','recapitulatif','paiement','confirmation'].map((s, i) => {
            const idx = STEPS.indexOf(step) - 1;
            const active = i === idx;
            const done = i < idx;
            return (
              <div key={s} className={`wq-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                <div className="wq-step-circle">{done ? '✓' : i + 1}</div>
                <div className="wq-step-label">{t(['صاحب الرسم','الطالب','الإرسال','الملخص','الأداء','التأكيد'][i], ['Titulaire','Demandeur','Livraison','Récap.','Paiement','Confirmé'][i])}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="wq-body">


        {/* ── ÉTAPE 0 : Accueil ── */}
        {step === 'accueil' && (
          <div className="wq-card wq-accueil animate-wq">
            <div className="wq-welcome-icon">📝</div>
            <h2 className={lang === 'ar' ? 'wq-ar' : ''}>{t('مرحباً بكم في أدمين كليك – طلب رسم الولادة', 'Bienvenue sur AdminClick – Demande d\'acte de naissance.')}</h2>
            <p className="wq-muted">{t('هل تريد البدء؟','Voulez-vous commencer ?')}</p>
            <div className="wq-actions">
              <button className="wq-btn wq-btn-primary" onClick={() => setStep('titulaire')}>
                {t('✅ نعم، ابدأ الطلب', '✅ Oui, commencer')}
              </button>
              <button className="wq-btn wq-btn-ghost" onClick={onCancel}>
                {t('إلغاء','Annuler')}
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 1 : Titulaire ── */}
        {step === 'titulaire' && (
          <div className="wq-card animate-wq">
            <div className="wq-step-header">
              <span className="wq-step-badge">1/5</span>
              <div>
                <h2 className="wq-ar">معلومات رسم الولادة</h2>
                <h3 className="wq-fr">Informations de l'acte de naissance</h3>
              </div>
            </div>

            {/* Acte Number & Year */}
            <div className="wq-row2">
              <div className="wq-field">
                <label><span className="wq-ar">رقم الرسم</span> / <span className="wq-fr">N° de l'acte</span></label>
                <input 
                  className={`wq-input ${touched.numActe && errs.numActe ? 'wq-input-err' : numeroActe ? 'wq-input-ok' : ''}`}
                  placeholder="Ex: 1234"
                  value={numeroActe}
                  onChange={e => setNumeroActe(e.target.value.replace(/\D/g,''))}
                  onBlur={() => touch('numActe')}
                />
                {touched.numActe && <ErrorMsg err={errs.numActe} />}
              </div>
              <div className="wq-field">
                <label><span className="wq-ar">سنة الرسم</span> / <span className="wq-fr">Année de l'acte (Hégirienne ou Grégorienne)</span></label>
                <input 
                  className={`wq-input ${touched.anneeActe && errs.anneeActe ? 'wq-input-err' : anneeActe ? 'wq-input-ok' : ''}`}
                  placeholder="Ex: 1990"
                  maxLength={4}
                  value={anneeActe}
                  onChange={e => setAnneeActe(e.target.value.replace(/\D/g,''))}
                  onBlur={() => touch('anneeActe')}
                />
                {touched.anneeActe && <ErrorMsg err={errs.anneeActe} />}
              </div>
            </div>

            <div className="wq-field">
              {!showKb ? (
                <>
                  <label>{t('الاسم الشخصي و العائلي بالعربية','Prénom(s) et nom en arabe')}</label>
                  <div className="wq-input-kb-wrap">
                    <input className={`wq-input rtl ${touched.nomAr && errs.nomAr ? 'wq-input-err' : touched.nomAr && !errs.nomAr ? 'wq-input-ok' : ''}`}
                      dir="rtl" placeholder={t('مثال: محمد بنعلي', 'Ex: Mohammed Benali')} value={nomAr}
                      onClick={() => { setKbNomAr(nomAr); setShowKb(true); }}
                      onBlur={() => touch('nomAr')} readOnly />
                    <button type="button" className="wq-btn-kb-open" onClick={() => { setKbNomAr(nomAr); setShowKb(true); }}>⌨</button>
                  </div>
                  {touched.nomAr && <ErrorMsg err={errs.nomAr} lang={lang} />}
                </>
              ) : (
                <VirtualKeyboard
                  value={kbNomAr}
                  onChange={setKbNomAr}
                  label={t('الاسم الشخصي و العائلي بالعربية','Prénom(s) et nom en arabe')}
                  onConfirm={() => { setNomAr(kbNomAr); touch('nomAr'); setShowKb(false); }}
                />
              )}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">الاسم الشخصي و العائلي بالفرنسية</span><span className="wq-sep">/</span><span className="wq-fr">Prénom(s) et nom en français</span></label>
              <input className={`wq-input ${touched.nomFr && errs.nomFr ? 'wq-input-err' : touched.nomFr && !errs.nomFr ? 'wq-input-ok' : ''}`} placeholder="Ex: Mohammed Benali" value={nomFr} onChange={e => setNomFr(e.target.value)} onBlur={() => touch('nomFr')} />
              {touched.nomFr && <ErrorMsg err={errs.nomFr} />}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">تاريخ الازدياد</span><span className="wq-sep">/</span><span className="wq-fr">Date de naissance</span></label>
              <input className={`wq-input ${touched.date && errs.date ? 'wq-input-err' : touched.date && !errs.date ? 'wq-input-ok' : ''}`} type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} onBlur={() => touch('date')} />
              {touched.date && <ErrorMsg err={errs.date} />}
            </div>

            {/* Hierarchical Geography Selection */}
            <div className="wq-field">
              <label><span className="wq-ar">الجهة</span> / <span className="wq-fr">Région de naissance</span></label>
              <select 
                className={`wq-input ${touched.region && errs.region ? 'wq-input-err' : selectedRegion ? 'wq-input-ok' : ''}`}
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                onBlur={() => touch('region')}
              >
                <option value="">-- {t('اختر الجهة', 'Choisir la région')} --</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>
                    TEST - {r.fr || 'vide'} - {r.ar || 'vide'}
                  </option>
                ))}
              </select>
            </div>

            {selectedRegion && (
              <div className="wq-field animate-wq">
                <label><span className="wq-ar">الإقليم / العمالة</span> / <span className="wq-fr">Province / Préfecture</span></label>
                <select 
                  className={`wq-input ${touched.province && errs.province ? 'wq-input-err' : selectedProvince ? 'wq-input-ok' : ''}`}
                  value={selectedProvince}
                  onChange={e => setSelectedProvince(e.target.value)}
                  onBlur={() => touch('province')}
                >
                  <option value="">-- {t('اختر الإقليم', 'Choisir la province')} --</option>
                  {provinces.map(p => <option key={p.id} value={p.id}>{t(p.ar, p.fr)}</option>)}
                </select>
              </div>
            )}

            {selectedProvince && (
              <div className="wq-field animate-wq">
                <label><span className="wq-ar">الجماعة / الدائرة</span> / <span className="wq-fr">Commune / Arrondissement</span></label>
                <select 
                  className="wq-input"
                  value={selectedCommuneId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedCommuneId(id);
                    const c = communes.find(x => x.id == id);
                    if (c) selectCommune({ nom: c.fr, display: `${t(c.ar, c.fr)}, ${selectedProvince}` });
                  }}
                >
                  <option value="">-- {t('اختر الجماعة', 'Choisir la commune')} --</option>
                  {communes.map(c => <option key={c.id} value={c.id}>{t(c.ar, c.fr)}</option>)}
                </select>
              </div>
            )}

            {/* Administration Selection (BEC / Moqata'a) */}
            {selectedCommuneId && (
              <div className="wq-field animate-wq" style={{marginTop: '1rem'}}>
                <label>
                  <span className="wq-ar">مكتب الحالة المدنية / المقاطعة</span>
                  <span className="wq-sep">/</span>
                  <span className="wq-fr">Bureau d'État Civil / Moqata'a</span>
                </label>
                <select 
                  className={`wq-input ${touched.bec && !bec ? 'wq-input-err' : bec ? 'wq-input-ok' : ''}`}
                  value={bec}
                  onChange={(e) => { setBec(e.target.value); touch('bec'); }}
                  onBlur={() => touch('bec')}
                >
                  <option value="">-- {t('اختر المكتب', 'Choisir le bureau')} --</option>
                  {becSuggestions.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="autre">{t('أخرى (أدخل يدوياً)', 'Autre (saisie manuelle)')}</option>
                </select>
                {bec === 'autre' && (
                  <input 
                    className="wq-input" 
                    style={{marginTop: '8px'}}
                    placeholder={t('اسم الإدارة...', 'Nom de l\'administration...')}
                    onChange={(e) => setBec(e.target.value)}
                  />
                )}
              </div>
            )}


            {/* CNIE prefill */}
            <div className="wq-field">
              <label>
                <span className="wq-ar">رقم البطاقة الوطنية (CNIE)</span><span className="wq-sep">/</span>
                <span className="wq-fr">Numéro CIN</span>
                <span className="wq-optional"> (اختياري / facultatif)</span>
              </label>
              <div className="wq-cnie-row">
                <input
                  className={`wq-input ${touched.cnie && errs.cnie && cnie ? 'wq-input-err' : cniePrefilled ? 'wq-input-ok' : ''}`}
                  placeholder="Ex: BK123456"
                  value={cnie}
                  onChange={e => { setCnie(e.target.value.toUpperCase()); setCniePrefilled(false); setCnieError(''); }}
                  onBlur={() => touch('cnie')}
                />
                <button
                  type="button"
                  className="wq-btn wq-btn-cnie"
                  onClick={handleCnieFetch}
                  disabled={cnieLoading || !cnie.trim()}
                >
                  {cnieLoading ? <span className="wq-spinner" /> : t('✦ تعبئة تلقائية', '✦ Pré-remplir')}
                </button>
              </div>
              {cnieError && <div className="wq-error">{cnieError}</div>}
              {cniePrefilled && <div className="wq-cnie-ok">✅ {t('تم تعبئة البيانات تلقائياً — يمكنك التعديل', 'Données pré-remplies — vous pouvez les modifier')}</div>}
              {touched.cnie && cnie && <ErrorMsg err={errs.cnie} />}
            </div>

            <div className="wq-actions">
              <button className="wq-btn wq-btn-ghost" onClick={() => setStep('accueil')}>← {t('تعديل', 'Retour')}</button>
              <button className="wq-btn wq-btn-primary" onClick={handleStep1}>
                {t('التالي', 'Suivant')} →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : Demandeur ── */}
        {step === 'demandeur' && (
          <div className="wq-card animate-wq">
            <div className="wq-step-header">
              <span className="wq-step-badge">2/5</span>
              <div>
                <h2 className="wq-ar">صلة القرابة و معلومات الطالب</h2>
                <h3 className="wq-fr">Lien de parenté et coordonnées du demandeur</h3>
              </div>
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">صلة القرابة</span><span className="wq-sep">/</span><span className="wq-fr">Lien de parenté</span></label>
              <div className="wq-radio-group">
                {lienOptions.map(opt => (
                  <label key={opt.value} className={`wq-radio-card ${lienParente === opt.value ? 'selected' : ''}`}>
                    <input type="radio" name="lien" value={opt.value} checked={lienParente === opt.value}
                      onChange={e => { setLienParente(e.target.value); touch('lien'); }} />
                    <span className="wq-ar">{opt.ar}</span> / <span className="wq-fr">{opt.fr}</span>
                  </label>
                ))}
              </div>
              {touched.lien && <ErrorMsg err={errs.lien} />}
              {lienParente === 'autre' && (
                <input className="wq-input" style={{marginTop: 8}} placeholder="Précisez / حدد" value={autreParente} onChange={e => setAutreParente(e.target.value)} />
              )}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">الاسم الكامل للطالب</span><span className="wq-sep">/</span><span className="wq-fr">Nom complet du demandeur</span></label>
              <input className={`wq-input ${touched.nomDem && errs.nomDem ? 'wq-input-err' : touched.nomDem && !errs.nomDem ? 'wq-input-ok' : ''}`} placeholder="Nom complet / الاسم الكامل" value={nomDemandeur} onChange={e => setNomDemandeur(e.target.value)} onBlur={() => touch('nomDem')} />
              {touched.nomDem && <ErrorMsg err={errs.nomDem} />}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">العنوان الكامل</span><span className="wq-sep">/</span><span className="wq-fr">Adresse complète</span></label>
              <textarea className={`wq-input wq-textarea ${touched.adresse && errs.adresse ? 'wq-input-err' : touched.adresse && !errs.adresse ? 'wq-input-ok' : ''}`} placeholder="Rue, quartier, ville, code postal / الشارع، الحي، المدينة، الرمز البريدي" value={adresse} onChange={e => setAdresse(e.target.value)} onBlur={() => touch('adresse')} rows={3} />
              {touched.adresse && <ErrorMsg err={errs.adresse} />}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">رقم الهاتف</span><span className="wq-sep">/</span><span className="wq-fr">Numéro de téléphone</span></label>
              <input className={`wq-input ${touched.tel && errs.tel ? 'wq-input-err' : touched.tel && !errs.tel ? 'wq-input-ok' : ''}`} placeholder="+212 6XX XXX XXX" value={telephone} onChange={e => setTelephone(e.target.value)} onBlur={() => touch('tel')} />
              {touched.tel && <ErrorMsg err={errs.tel} />}
            </div>

            <div className="wq-field">
              <label><span className="wq-ar">البريد الإلكتروني</span><span className="wq-sep">/</span><span className="wq-fr">Adresse e-mail</span></label>
              <input className={`wq-input ${touched.email && errs.email ? 'wq-input-err' : touched.email && !errs.email ? 'wq-input-ok' : ''}`} type="email" placeholder="exemple@email.ma" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => touch('email')} />
              {touched.email && <ErrorMsg err={errs.email} />}
            </div>

            <div className="wq-actions">
              <button className="wq-btn wq-btn-ghost" onClick={() => setStep('titulaire')}>← {t('تعديل', 'Retour')}</button>
              <button className="wq-btn wq-btn-primary" onClick={handleStep2}>
                {t('التالي', 'Suivant')} →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : Livraison ── */}
        {step === 'livraison' && (
          <div className="wq-card animate-wq">
            <div className="wq-step-header">
              <span className="wq-step-badge">3/5</span>
              <div>
                <h2 className="wq-ar">الإرسال</h2>
                <h3 className="wq-fr">Mode de livraison</h3>
              </div>
            </div>

            <div className="wq-livraison-card selected">
              <div className="wq-livraison-icon">✉️</div>
              <div>
                <p className="wq-ar">الإرسال عبر البريد المضمون (بريد المغرب)</p>
                <p className="wq-fr">Envoi par courrier recommandé (Barid Al-Maghrib)</p>
                <p className="wq-price">💳 30 DH — رسوم البريد / Frais de port</p>
              </div>
              <span className="wq-check-badge">✓</span>
            </div>

            <div className="wq-info-box">
              <p className="wq-ar">⏳ المدة المقدرة: من 5 إلى 10 أيام عمل</p>
              <p className="wq-fr">⏳ Délai estimé: 5 à 10 jours ouvrés</p>
            </div>

            <div className="wq-field animate-wq">
              <label><span className="wq-ar">وكالة البريد / وكالة الاستلام الأقرب</span> / <span className="wq-fr">Agence Barid Al-Maghrib la plus proche</span></label>
              <select 
                className="wq-input"
                value={deliveryAgency}
                onChange={e => setDeliveryAgency(e.target.value)}
              >
                <option value="">-- {t('اختر الوكالة الأقرب لعنوانك', 'Choisir l\'agence la plus proche de votre adresse')} --</option>
                <option value="Agence Centrale">Agence Centrale</option>
                <option value="Agence Principale">Agence Principale</option>
                <option value="Point Relais - Quartier Administratif">Point Relais - Quartier Administratif</option>
                <option value="Bureau de Poste - Annexe">Bureau de Poste - Annexe</option>
              </select>
              <p className="wq-muted" style={{fontSize: '0.75rem', marginTop: '4px'}}>
                {t('سيتم توجيه الظرف المضمون إلى هذه الوكالة في حال عدم تواجدكم بالمنزل.', 'Le courrier sera déposé dans cette agence si vous êtes absent lors du passage du facteur.')}
              </p>
            </div>

            <div className="wq-actions">
              <button className="wq-btn wq-btn-ghost" onClick={() => setStep('demandeur')}>← {t('تعديل', 'Retour')}</button>
              <button className="wq-btn wq-btn-primary" onClick={() => setStep('recapitulatif')}>
                {t('التالي', 'Suivant')} →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 4 : Récapitulatif ── */}
        {step === 'recapitulatif' && (
          <div className="wq-card animate-wq">
            <div className="wq-step-header">
              <span className="wq-step-badge">4/5</span>
              <div>
                <h2 className="wq-ar">ملخص الطلب</h2>
                <h3 className="wq-fr">Récapitulatif de la demande</h3>
              </div>
            </div>

            <div className="wq-recap-notice">
              📝 <span className="wq-ar">يمكنكم التعديل قبل التأكيد</span> &nbsp;/&nbsp; <span className="wq-fr">Vous pouvez modifier avant de confirmer</span>
            </div>

            <table className="wq-table">
              <tbody>
                <tr className="wq-table-section">
                  <td colSpan={2}>👶 <strong>معلومات المولود / Titulaire</strong></td>
                </tr>
                <tr>
                  <td>{t('رقم و سنة الرسم', 'N° et Année de l\'acte')}</td>
                  <td>{numeroActe} / {anneeActe} <button className="wq-edit-btn" onClick={() => setStep('titulaire')}>{t('تعديل', 'Modifier')}</button></td>
                </tr>
                <tr>
                  <td>{t('الاسم بالعربية', 'Nom (AR)')}</td>
                  <td>{nomAr}</td>
                </tr>
                <tr>
                  <td>{t('الاسم بالفرنسية', 'Nom (FR)')}</td>
                  <td>{nomFr}</td>
                </tr>
                <tr>
                  <td>{t('تاريخ الازدياد', 'Date de naissance')}</td>
                  <td>{fmtDate(dateNaissance)}</td>
                </tr>
                <tr>
                  <td>{t('مكان الازدياد', 'Lieu de naissance')}</td>
                  <td>{lieuNaissance}</td>
                </tr>
                {bec && (
                  <tr>
                    <td>{t('مكتب الحالة المدنية', 'Bureau d\'État Civil')}</td>
                    <td>{bec}</td>
                  </tr>
                )}
                {cnie && <tr><td>{t('رقم البطاقة الوطنية', 'Numéro CIN')}</td><td>{cnie}</td></tr>}

                <tr className="wq-table-section">
                  <td colSpan={2}>🧾 <strong>{t('معلومات الطالب', 'Coordonnées du demandeur')}</strong></td>
                </tr>
                <tr>
                  <td>{t('صلة القرابة', 'Lien de parenté')}</td>
                  <td>{getLienLabel()} <button className="wq-edit-btn" onClick={() => setStep('demandeur')}>{t('تعديل', 'Modifier')}</button></td>
                </tr>
                <tr><td>{t('الاسم', 'Nom')}</td><td>{nomDemandeur}</td></tr>
                <tr><td>{t('العنوان', 'Adresse')}</td><td>{adresse}</td></tr>
                <tr><td>{t('الهاتف', 'Tél')}</td><td>{telephone}</td></tr>
                <tr><td>{t('البريد', 'Email')}</td><td>{email}</td></tr>

                <tr className="wq-table-section">
                  <td colSpan={2}>✉️ <strong>{t('الإرسال', 'Livraison')}</strong></td>
                </tr>
                <tr><td>{t('الطريقة', 'Mode')}</td><td>{t('بريد مضمون (بريد المغرب)', 'Barid Al-Maghrib (recommandé)')}</td></tr>
                <tr><td>{t('الوكالة', 'Agence')}</td><td>{deliveryAgency || 'Défaut'}</td></tr>
                <tr><td>{t('الرسوم', 'Frais')}</td><td>30 DH</td></tr>
              </tbody>
            </table>

            <div className="wq-actions">
              <button className="wq-btn wq-btn-ghost" onClick={() => setStep('livraison')}>← {t('تعديل', 'Retour')}</button>
              <button className="wq-btn wq-btn-primary" onClick={() => setStep('paiement')}>
                💳 تأكيد و أداء / Confirmer et payer
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 5 : Paiement (CMI simulé) ── */}
        {step === 'paiement' && (
          <div className="wq-card animate-wq">
            <div className="wq-step-header">
              <span className="wq-step-badge">5/5</span>
              <div>
                <h2 className="wq-ar">تأكيد و أداء</h2>
                <h3 className="wq-fr">Confirmation et paiement</h3>
              </div>
            </div>

            <div className="wq-cmi-banner">
              <div className="wq-cmi-logo">🏦 CMI</div>
              <div>
                <p className="wq-ar">مركز النقد الآلي البنكي المشترك — الأداء الآمن</p>
                <p className="wq-fr">Centre Monétique Interbancaire — Paiement sécurisé</p>
              </div>
            </div>

            <div className="wq-pay-amount">
              {t('المبلغ الإجمالي', 'Montant total')}
              <strong className="wq-amount">30,00 DH</strong>
            </div>

            <form onSubmit={handlePay}>
              <div className="wq-field">
                <label>💳 {t('رقم البطاقة البنكية', 'Numéro de carte')}</label>
                <input className={`wq-input ${touched.carte && errs.carte ? 'wq-input-err' : touched.carte && !errs.carte ? 'wq-input-ok' : ''}`} placeholder="XXXX XXXX XXXX XXXX" maxLength={19} value={carte}
                  onChange={e => setCarte(fmtCarte(e.target.value))} onBlur={() => touch('carte')} />
                {touched.carte && <ErrorMsg err={errs.carte} lang={lang} />}
              </div>
              <div className="wq-row2">
                <div className="wq-field">
                  <label>{t('تاريخ الانتهاء', 'Date d\'expiration')}</label>
                  <input className={`wq-input ${touched.expiry && errs.expiry ? 'wq-input-err' : touched.expiry && !errs.expiry ? 'wq-input-ok' : ''}`} placeholder="MM/AA" maxLength={5} value={expiry}
                    onChange={e => setExpiry(fmtExpiry(e.target.value))} onBlur={() => touch('expiry')} />
                  {touched.expiry && <ErrorMsg err={errs.expiry} lang={lang} />}
                </div>
                <div className="wq-field">
                  <label>CVV / {t('رمز الأمان', 'Code de sécurité')}</label>
                  <input className={`wq-input ${touched.cvv && errs.cvv ? 'wq-input-err' : touched.cvv && !errs.cvv ? 'wq-input-ok' : ''}`} placeholder="XXX" maxLength={3} type="password" value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g,''))} onBlur={() => touch('cvv')} />
                  {touched.cvv && <ErrorMsg err={errs.cvv} lang={lang} />}
                </div>
              </div>
              <p className="wq-sim-notice">⚠️ {t('بيانات تجريبية فقط - محاكاة فقط', 'Données fictives — simulation uniquement')}</p>
              {submitError && <div className="wq-error" style={{marginBottom:'1rem'}}>{submitError}</div>}
              <div className="wq-actions">
                <button type="button" className="wq-btn wq-btn-ghost" onClick={() => setStep('recapitulatif')}>← {t('تعديل', 'Modifier')}</button>
                <button type="submit" className="wq-btn wq-btn-pay" disabled={payLoading}>
                  {payLoading ? <><span className="wq-spinner" /> {t('جارٍ الإرسال...', 'Envoi en cours...')}</> : '🔒 ' + t('تأكيد الأداء', 'Valider le paiement')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ÉTAPE 6 : Confirmation ── */}
        {step === 'confirmation' && (
          <div className="wq-card wq-confirmation animate-wq">
            <div className="wq-confirm-icon">✅</div>
            <h2 className="wq-ar">تم تسجيل طلبكم بنجاح</h2>
            <h3 className="wq-fr">Votre demande a bien été enregistrée.</h3>

            <div className="wq-order-box">
              <p>{t('رقم الطلب', 'Numéro de commande')}</p>
              <strong className="wq-order-num">
                {realOrderId ? `ADM-${String(realOrderId).padStart(5,'0')}` : orderNumber}
              </strong>
            </div>

            <div className="wq-info-box">
              <p>{t('📬 سيتم إرسال الوثيقة خلال 5 إلى 10 أيام عمل عبر بريد المغرب', '📬 L\'acte sera envoyé sous 5 à 10 jours ouvrés via Barid Al-Maghrib.')}</p>
            </div>

            <div className="wq-summary-line"><span>{t('المبلغ المدفوع :', 'Montant payé :')}</span><strong>30,00 DH</strong></div>
            <div className="wq-summary-line"><span>{t('الاسم :', 'Nom :')}</span><strong>{nomFr}</strong></div>
            <div className="wq-summary-line"><span>{t('البريد :', 'Email :')}</span><strong>{email}</strong></div>

            <div className="wq-actions" style={{marginTop: '1.5rem'}}>
              <button className="wq-btn wq-btn-outline" onClick={() => window.print()}>
                📄 {t('تحميل الملخص', 'Télécharger le récapitulatif')}
              </button>
              <button className="wq-btn wq-btn-primary" onClick={onCancel}>
                {t('العودة للرئيسية', 'Retour')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
