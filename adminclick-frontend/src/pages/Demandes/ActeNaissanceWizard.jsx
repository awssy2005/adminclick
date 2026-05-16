import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './ActeNaissanceWizard.css';
import VirtualKeyboard from '../../components/VirtualKeyboard/VirtualKeyboard';
import AdministrativeSelector from '../../components/AdministrativeSelector/AdministrativeSelector';

const STEPS = [
  'step1_applicant',
  'step2_parents',
  'step3_civil_status',
  'step4_document_type',
  'step5_delivery_mode',
  'step6_validation',
  'step7_tracking',
];

export default function ActeNaissanceWizard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    cin: '', nom_fr: '', nom_ar: '', prenom_fr: '', prenom_ar: '',
    date_naissance: '', sexe: '', nationalite: '', // ← nouveaux champs
    telephone: '', email: '',
    adresse: '',
    region_naissance: '', ville_naissance: '', arrondissement_naissance: '', secteur_naissance: '',
    region_naissance_ar: '', ville_naissance_ar: '', arrondissement_naissance_ar: '', secteur_naissance_ar: '',
    secteur_naissance_numero: '',
    nom_pere_fr: '', nom_pere_ar: '', nom_mere_fr: '', nom_mere_ar: '',
    date_naissance_parent: '',
    region_parent: '', ville_parent: '', arrondissement_parent: '', secteur_parent: '',
    region_parent_ar: '', ville_parent_ar: '', arrondissement_parent_ar: '', secteur_parent_ar: '',
    secteur_parent_numero: '',
    bureau_region: '', bureau_ville: '', bureau_arrondissement: '', bureau_secteur: '',
    bureau_region_ar: '', bureau_ville_ar: '', bureau_arrondissement_ar: '', bureau_secteur_ar: '',
    bureau_secteur_numero: '',
    numero_registre: '', annee_registre: '',
    type_document: 'simple', langue_document: 'fr',
    mode_reception: 'domicile', adresse_livraison: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [keyboardField, setKeyboardField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep = (current) => {
    const required = [];
    if (current === 1) required.push(
      'cin', 'nom_fr', 'nom_ar', 'prenom_fr', 'prenom_ar',
      'date_naissance', 'adresse', 'telephone', 'email',
      'secteur_naissance', 'sexe', 'nationalite' // ← ajouté
    );
    if (current === 2) required.push('nom_pere_fr', 'nom_pere_ar', 'nom_mere_fr', 'nom_mere_ar', 'secteur_parent');
    if (current === 3) required.push('bureau_secteur');
    if (current === 4) required.push('type_document', 'langue_document');
    if (current === 5) {
      required.push('mode_reception');
      if (form.mode_reception === 'domicile') required.push('adresse_livraison');
    }
    const errs = {};
    required.forEach(field => {
      if (!form[field]) errs[field] = t('required_field');
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep = (targetStep) => {
    if (targetStep < step && targetStep >= 1) {
      setStep(targetStep);
      setErrors({});
    }
  };

  const nextStep = () => {
    if (step < 6 && validateStep(step)) setStep(step + 1);
    if (step === 6) handleSubmit();
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    setLoading(true);
    try {
      const cinCheck = await api.get(`/cin/verify/${form.cin}`);
      if (!cinCheck.data.valid) {
        alert(t('invalid_cin'));
        setLoading(false);
        return;
      }
      const payload = {
        ...form,
        lieu_naissance_fr: `${form.secteur_naissance}, ${form.arrondissement_naissance}, ${form.ville_naissance}, ${form.region_naissance}`,
        lieu_naissance_ar: `${form.secteur_naissance_ar}، ${form.arrondissement_naissance_ar}، ${form.ville_naissance_ar}، ${form.region_naissance_ar}`,
        lieu_naissance_parent_fr: `${form.secteur_parent}, ${form.arrondissement_parent}, ${form.ville_parent}, ${form.region_parent}`,
        lieu_naissance_parent_ar: `${form.secteur_parent_ar}، ${form.arrondissement_parent_ar}، ${form.ville_parent_ar}، ${form.region_parent_ar}`,
        bureau_etat_civil_fr: `${form.bureau_secteur}, ${form.bureau_arrondissement}, ${form.bureau_ville}, ${form.bureau_region}`,
        bureau_etat_civil_ar: `${form.bureau_secteur_ar}، ${form.bureau_arrondissement_ar}، ${form.bureau_ville_ar}، ${form.bureau_region_ar}`,
      };
      const res = await api.post('/demandes', payload);
      setLoading(false);
      navigate(`/demandes/${res.data.id}`);
    } catch (err) {
      setLoading(false);
      // Affiche le message d'erreur exact retourné par l'API
      const msg = err.response?.data?.message || err.response?.data?.error || t('submission_error');
      alert(msg);
    }
  };

  const openKeyboard = (fieldName) => setKeyboardField(fieldName);
  const closeKeyboard = () => setKeyboardField(null);
  const handleKeyPress = (char) => {
    if (!keyboardField) return;
    const input = document.querySelector(`[name="${keyboardField}"]`);
    if (!input) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = form[keyboardField] || '';
    const newValue = currentValue.substring(0, start) + char + currentValue.substring(end);
    setForm({ ...form, [keyboardField]: newValue });
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const FieldError = ({ field }) => (
    errors[field] ? <span className="field-error">{errors[field]}</span> : null
  );

  const ArabicField = ({ name, value, placeholder }) => {
    const isOpen = keyboardField === name;
    return (
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input name={name} value={value} onChange={handleChange} placeholder={placeholder} style={{ flex: 1 }} />
          <button type="button" onClick={() => (isOpen ? closeKeyboard() : openKeyboard(name))}
            style={{ background: isOpen ? '#e0e0e0' : 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '1.2rem' }}>
            ⌨️
          </button>
        </div>
        {isOpen && <div style={{ marginTop: '4px' }}><VirtualKeyboard onKeyPress={handleKeyPress} onClose={closeKeyboard} /></div>}
        <FieldError field={name} />
      </div>
    );
  };

  return (
    <div className="wizard-layout">
      <aside className="wizard-sidebar">
        <h3>{t('steps')}</h3>
        <ul className="step-list-vertical">
          {STEPS.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <li
                key={idx}
                className={`step-vertical ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isCompleted ? 'clickable' : ''}`}
                onClick={() => isCompleted && goToStep(stepNum)}
              >
                <span className="step-number-vertical">{stepNum}</span>
                <span className="step-label-vertical">{t(s)}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="wizard-main">
        <div className="step-content">
          {step === 1 && (
            <div>
              <h2>{t('applicant_info')}</h2>
              <div className="form-field">
                <input name="cin" value={form.cin} onChange={handleChange} placeholder={t('cin')} />
                <FieldError field="cin" />
              </div>
              <div className="form-field">
                <input name="nom_fr" value={form.nom_fr} onChange={handleChange} placeholder={t('last_name_fr')} />
                <FieldError field="nom_fr" />
              </div>
              <div className="form-field">
                <ArabicField name="nom_ar" value={form.nom_ar} placeholder={t('last_name_ar')} />
              </div>
              <div className="form-field">
                <input name="prenom_fr" value={form.prenom_fr} onChange={handleChange} placeholder={t('first_name_fr')} />
                <FieldError field="prenom_fr" />
              </div>
              <div className="form-field">
                <ArabicField name="prenom_ar" value={form.prenom_ar} placeholder={t('first_name_ar')} />
              </div>
              <div className="form-field">
                <input name="date_naissance" type="date" value={form.date_naissance} onChange={handleChange} />
                <FieldError field="date_naissance" />
              </div>

              {/* Sexe */}
              <div className="form-field">
                <label>{t('sexe')}</label>
                <select name="sexe" value={form.sexe} onChange={handleChange}>
                  <option value="">-- {t('select_sexe')} --</option>
                  <option value="M">{t('male')}</option>
                  <option value="F">{t('female')}</option>
                </select>
                <FieldError field="sexe" />
              </div>

              {/* Nationalité */}
              <div className="form-field">
                <label>{t('nationalite')}</label>
                <input name="nationalite" value={form.nationalite} onChange={handleChange} placeholder={t('nationalite_placeholder')} />
                <FieldError field="nationalite" />
              </div>

              <div className="form-field">
                <input name="adresse" value={form.adresse} onChange={handleChange} placeholder={t('address')} />
                <FieldError field="adresse" />
              </div>
              <div className="form-field">
                <input name="telephone" value={form.telephone} onChange={handleChange} placeholder={t('phone')} />
                <FieldError field="telephone" />
              </div>
              <div className="form-field">
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <FieldError field="email" />
              </div>

              <div className="form-field">
                <label>{t('birth_place')}</label>
                <AdministrativeSelector onChange={(data) => setForm(prev => ({
                  ...prev,
                  region_naissance: data.region?.nom || '',
                  ville_naissance: data.ville?.nom || '',
                  arrondissement_naissance: data.arrondissement?.nom || '',
                  secteur_naissance: data.secteur?.nom || '',
                  region_naissance_ar: data.region?.nom_ar || '',
                  ville_naissance_ar: data.ville?.nom_ar || '',
                  arrondissement_naissance_ar: data.arrondissement?.nom_ar || '',
                  secteur_naissance_ar: data.secteur?.nom_ar || '',
                  secteur_naissance_numero: data.secteur?.numero || '',
                }))} />
                <FieldError field="secteur_naissance" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>{t('parents_info')}</h2>
              <div className="form-field">
                <input name="nom_pere_fr" value={form.nom_pere_fr} onChange={handleChange} placeholder={t('father_last_name_fr')} />
                <FieldError field="nom_pere_fr" />
              </div>
              <div className="form-field">
                <ArabicField name="nom_pere_ar" value={form.nom_pere_ar} placeholder={t('father_last_name_ar')} />
              </div>
              <div className="form-field">
                <input name="nom_mere_fr" value={form.nom_mere_fr} onChange={handleChange} placeholder={t('mother_last_name_fr')} />
                <FieldError field="nom_mere_fr" />
              </div>
              <div className="form-field">
                <ArabicField name="nom_mere_ar" value={form.nom_mere_ar} placeholder={t('mother_last_name_ar')} />
              </div>
              <div className="form-field">
                <input name="date_naissance_parent" type="date" value={form.date_naissance_parent} onChange={handleChange} placeholder={t('parent_birth_date')} />
                <FieldError field="date_naissance_parent" />
              </div>

              <div className="form-field">
                <label>{t('parent_birth_place')}</label>
                <AdministrativeSelector onChange={(data) => setForm(prev => ({
                  ...prev,
                  region_parent: data.region?.nom || '',
                  ville_parent: data.ville?.nom || '',
                  arrondissement_parent: data.arrondissement?.nom || '',
                  secteur_parent: data.secteur?.nom || '',
                  region_parent_ar: data.region?.nom_ar || '',
                  ville_parent_ar: data.ville?.nom_ar || '',
                  arrondissement_parent_ar: data.arrondissement?.nom_ar || '',
                  secteur_parent_ar: data.secteur?.nom_ar || '',
                  secteur_parent_numero: data.secteur?.numero || '',
                }))} />
                <FieldError field="secteur_parent" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2>{t('civil_registry_info')}</h2>
              <div className="form-field">
                <label>{t('civil_office')}</label>
                <AdministrativeSelector onChange={(data) => setForm(prev => ({
                  ...prev,
                  bureau_region: data.region?.nom || '',
                  bureau_ville: data.ville?.nom || '',
                  bureau_arrondissement: data.arrondissement?.nom || '',
                  bureau_secteur: data.secteur?.nom || '',
                  bureau_region_ar: data.region?.nom_ar || '',
                  bureau_ville_ar: data.ville?.nom_ar || '',
                  bureau_arrondissement_ar: data.arrondissement?.nom_ar || '',
                  bureau_secteur_ar: data.secteur?.nom_ar || '',
                  bureau_secteur_numero: data.secteur?.numero || '',
                }))} />
                <FieldError field="bureau_secteur" />
              </div>
              <div className="form-field">
                <input name="numero_registre" value={form.numero_registre} onChange={handleChange} placeholder={t('registry_number')} />
                <FieldError field="numero_registre" />
              </div>
              <div className="form-field">
                <input name="annee_registre" type="number" value={form.annee_registre} onChange={handleChange} placeholder={t('registry_year')} />
                <FieldError field="annee_registre" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2>{t('document_type')}</h2>

              <div className="doc-type-cards">
                <div
                  className={`doc-card ${form.type_document === 'integrale' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, type_document: 'integrale' })}
                >
                  <div className="doc-card-icon">📄</div>
                  <div className="doc-card-body">
                    <span className="doc-card-title">{t('full_copy')}</span>
                    <span className="doc-card-desc">{t('full_copy_desc')}</span>
                  </div>
                  {form.type_document === 'integrale' && <span className="doc-card-check">✓</span>}
                </div>

                <div
                  className={`doc-card ${form.type_document === 'simple' ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, type_document: 'simple' })}
                >
                  <div className="doc-card-icon">📃</div>
                  <div className="doc-card-body">
                    <span className="doc-card-title">{t('simple_extract')}</span>
                    <span className="doc-card-desc">{t('simple_extract_desc')}</span>
                  </div>
                  {form.type_document === 'simple' && <span className="doc-card-check">✓</span>}
                </div>
              </div>

              {form.type_document && (
                <div className="acte-preview">
                  <img
                    src={`/images/acte_${form.type_document}.png`}
                    alt={form.type_document === 'integrale' ? t('full_copy') : t('simple_extract')}
                    className="acte-preview-img"
                  />
                </div>
              )}

              <div className="form-field" style={{ marginTop: '24px' }}>
                <label>{t('document_language')}</label>
                <select name="langue_document" value={form.langue_document} onChange={handleChange}>
                  <option value="fr">{t('french')}</option>
                  <option value="ar">{t('arabic')}</option>
                  <option value="bilingue">{t('bilingual')}</option>
                </select>
                <FieldError field="langue_document" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2>{t('delivery_mode')}</h2>
              <div className="form-field">
                <label><input type="radio" name="mode_reception" value="domicile" checked={form.mode_reception === 'domicile'} onChange={handleChange} /> {t('home_delivery')}</label>
                <label><input type="radio" name="mode_reception" value="bureau" checked={form.mode_reception === 'bureau'} onChange={handleChange} /> {t('office_pickup')}</label>
                <FieldError field="mode_reception" />
              </div>
              {form.mode_reception === 'domicile' && (
                <div className="form-field">
                  <input name="adresse_livraison" value={form.adresse_livraison} onChange={handleChange} placeholder={t('delivery_address')} />
                  <FieldError field="adresse_livraison" />
                </div>
              )}
            </div>
          )}

          {step === 6 && (
            <div>
              <h2>{t('summary')}</h2>
              <pre>{JSON.stringify(form, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="step-actions">
          {step > 1 && <button onClick={prevStep}>{t('previous')}</button>}
          <button onClick={nextStep} disabled={loading}>
            {step === 6 ? t('submit') : t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}