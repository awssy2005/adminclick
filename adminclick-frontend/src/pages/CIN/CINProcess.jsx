import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './CINProcess.css';

const STEPS = [
  { num: 1, label: 'Infos personnelles' },
  { num: 2, label: 'Documents' },
  { num: 3, label: 'Rendez-vous' },
  { num: 4, label: 'Paiement' },
  { num: 5, label: 'Confirmation' },
];

export default function CINProcess() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demandeId, setDemandeId] = useState(null);

  // Step 1 — Personal info
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [lieuNaissance, setLieuNaissance] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('premiere_demande');

  // Step 2 — Documents
  const [photoIdentite, setPhotoIdentite] = useState(null);
  const [acteNaissance, setActeNaissance] = useState(null);
  const [justificatifDomicile, setJustificatifDomicile] = useState(null);

  // Step 3 — Appointment
  const [rdvDate, setRdvDate] = useState('');
  const [rdvTime, setRdvTime] = useState('');
  const [rdvLocation, setRdvLocation] = useState('Commune Principale — Siège');

  // Step 4 — Payment
  const [paymentMethod, setPaymentMethod] = useState('carte');

  const handleStep1 = () => {
    if (!nom || !prenom || !dateNaissance || !lieuNaissance || !adresse) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = async () => {
    setError('');
    setLoading(true);
    try {
      const description = `
Nom: ${nom}
Prénom: ${prenom}
Date de naissance: ${dateNaissance}
Lieu de naissance: ${lieuNaissance}
Adresse: ${adresse}
Téléphone: ${telephone}
Motif: ${motif === 'premiere_demande' ? 'Première demande' : motif === 'renouvellement' ? 'Renouvellement' : 'Perte/Vol'}
      `.trim();

      const formData = new FormData();
      formData.append('type', 'carte_nationale');
      formData.append('description', description);
      if (photoIdentite) formData.append('files[]', photoIdentite);
      if (acteNaissance) formData.append('files[]', acteNaissance);
      if (justificatifDomicile) formData.append('files[]', justificatifDomicile);

      const res = await api.post('/demandes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDemandeId(res.data.id);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (!rdvDate || !rdvTime) {
      setError('Veuillez choisir une date et un créneau.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/appointments', {
        demande_id: demandeId,
        date: rdvDate,
        time: rdvTime,
        location: rdvLocation,
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la prise de rendez-vous.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep4 = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/payments', {
        demande_id: demandeId,
        amount: 75.00,
        method: paymentMethod,
      });
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement.');
    } finally {
      setLoading(false);
    }
  };

  // Compute min date for appointment (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="cin-page">
      <div className="container">
        <div className="cin-header animate-fade-in-up">
          <h1 className="cin-title">🪪 Demande de Carte Nationale d'Identité</h1>
          <p className="cin-subtitle">Effectuez toute la démarche en ligne en 5 étapes simples</p>
        </div>

        {/* Stepper */}
        <div className="stepper animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} className={`stepper-step ${step > s.num ? 'completed' : ''} ${step === s.num ? 'active' : ''}`}>
              <div className="stepper-dot">{step > s.num ? '✓' : s.num}</div>
              <span className="stepper-label">{s.label}</span>
              {i < STEPS.length - 1 && <div className="stepper-line"></div>}
            </div>
          ))}
        </div>

        {error && <div className="admin-message error animate-fade-in-up">{error}</div>}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="cin-step card animate-fade-in-up">
            <div className="card-body">
              <h2 className="cin-step-title">📝 Informations personnelles</h2>
              <p className="cin-step-desc">Renseignez vos informations pour la carte nationale</p>

              <div className="cin-form-grid">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input className="form-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom de famille" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input className="form-input" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de naissance *</label>
                  <input className="form-input" type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Lieu de naissance *</label>
                  <input className="form-input" value={lieuNaissance} onChange={e => setLieuNaissance(e.target.value)} placeholder="Ex: Casablanca" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Adresse complète *</label>
                  <input className="form-input" value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Votre adresse complète" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="+212 6XX-XXXXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Motif de la demande</label>
                  <select className="form-input form-select" value={motif} onChange={e => setMotif(e.target.value)}>
                    <option value="premiere_demande">Première demande</option>
                    <option value="renouvellement">Renouvellement</option>
                    <option value="perte_vol">Perte ou vol</option>
                  </select>
                </div>
              </div>

              <div className="cin-actions">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Annuler</button>
                <button className="btn btn-primary btn-lg" onClick={handleStep1}>Suivant →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="cin-step card animate-fade-in-up">
            <div className="card-body">
              <h2 className="cin-step-title">📎 Documents requis</h2>
              <p className="cin-step-desc">Joignez les documents nécessaires à votre demande</p>

              <div className="cin-docs-grid">
                <div className="cin-doc-upload">
                  <label className="cin-doc-label">
                    <span className="cin-doc-icon">📷</span>
                    <span className="cin-doc-name">Photo d'identité</span>
                    <span className="cin-doc-hint">Format 3.5x4.5 cm, fond blanc</span>
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setPhotoIdentite(e.target.files[0])} className="cin-doc-input" />
                    {photoIdentite && <span className="cin-doc-selected">✅ {photoIdentite.name}</span>}
                  </label>
                </div>
                <div className="cin-doc-upload">
                  <label className="cin-doc-label">
                    <span className="cin-doc-icon">📄</span>
                    <span className="cin-doc-name">Acte de naissance</span>
                    <span className="cin-doc-hint">Copie intégrale récente</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setActeNaissance(e.target.files[0])} className="cin-doc-input" />
                    {acteNaissance && <span className="cin-doc-selected">✅ {acteNaissance.name}</span>}
                  </label>
                </div>
                <div className="cin-doc-upload">
                  <label className="cin-doc-label">
                    <span className="cin-doc-icon">🏠</span>
                    <span className="cin-doc-name">Justificatif de domicile</span>
                    <span className="cin-doc-hint">Facture ou certificat de résidence</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setJustificatifDomicile(e.target.files[0])} className="cin-doc-input" />
                    {justificatifDomicile && <span className="cin-doc-selected">✅ {justificatifDomicile.name}</span>}
                  </label>
                </div>
              </div>

              <div className="cin-actions">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Retour</button>
                <button className="btn btn-primary btn-lg" onClick={handleStep2} disabled={loading}>
                  {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Soumettre et continuer →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Appointment */}
        {step === 3 && (
          <div className="cin-step card animate-fade-in-up">
            <div className="card-body">
              <h2 className="cin-step-title">📅 Prise de rendez-vous</h2>
              <p className="cin-step-desc">Choisissez la date et le lieu pour le dépôt de votre dossier</p>

              <div className="cin-form-grid">
                <div className="form-group">
                  <label className="form-label">Date du rendez-vous *</label>
                  <input className="form-input" type="date" min={minDate} value={rdvDate} onChange={e => setRdvDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Créneau horaire *</label>
                  <select className="form-input form-select" value={rdvTime} onChange={e => setRdvTime(e.target.value)}>
                    <option value="">— Sélectionner —</option>
                    <option value="08:00">08:00 - 09:00</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="11:00">11:00 - 12:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Lieu</label>
                  <select className="form-input form-select" value={rdvLocation} onChange={e => setRdvLocation(e.target.value)}>
                    <option value="Commune Principale — Siège">Commune Principale — Siège</option>
                    <option value="Annexe Administrative — Centre ville">Annexe Administrative — Centre ville</option>
                    <option value="Bureau Communal — Quartier Nord">Bureau Communal — Quartier Nord</option>
                    <option value="Antenne Administrative — Quartier Sud">Antenne Administrative — Quartier Sud</option>
                  </select>
                </div>
              </div>

              <div className="cin-info-box">
                <strong>📌 À apporter le jour du rendez-vous :</strong>
                <ul>
                  <li>• Originaux de tous les documents soumis en ligne</li>
                  <li>• Ancienne CIN (en cas de renouvellement)</li>
                  <li>• Récépissé de perte (en cas de perte/vol)</li>
                </ul>
              </div>

              <div className="cin-actions">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Retour</button>
                <button className="btn btn-primary btn-lg" onClick={handleStep3} disabled={loading}>
                  {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Confirmer le rendez-vous →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="cin-step card animate-fade-in-up">
            <div className="card-body">
              <h2 className="cin-step-title">💳 Paiement des frais</h2>
              <p className="cin-step-desc">Réglez les frais de traitement de votre demande</p>

              <div className="cin-payment-summary">
                <div className="cin-payment-row">
                  <span>Frais de dossier CIN</span>
                  <span>50.00 MAD</span>
                </div>
                <div className="cin-payment-row">
                  <span>Timbre fiscal</span>
                  <span>25.00 MAD</span>
                </div>
                <div className="cin-payment-row cin-payment-total">
                  <span>Total</span>
                  <span>75.00 MAD</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Méthode de paiement</label>
                <div className="cin-payment-methods">
                  {[
                    { id: 'carte', label: '💳 Carte bancaire', desc: 'Visa, Mastercard' },
                    { id: 'virement', label: '🏦 Virement bancaire', desc: 'Transfert direct' },
                    { id: 'especes', label: '💵 Espèces', desc: 'Au guichet le jour du RDV' },
                  ].map(m => (
                    <label key={m.id} className={`cin-payment-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={e => setPaymentMethod(e.target.value)} className="sr-only" />
                      <span className="cin-payment-option-label">{m.label}</span>
                      <span className="cin-payment-option-desc">{m.desc}</span>
                      {paymentMethod === m.id && <span className="cin-payment-check">✓</span>}
                    </label>
                  ))}
                </div>
              </div>

              <div className="cin-actions">
                <button className="btn btn-secondary" onClick={() => setStep(3)}>← Retour</button>
                <button className="btn btn-accent btn-lg" onClick={handleStep4} disabled={loading}>
                  {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Payer 75.00 MAD →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="cin-step card animate-fade-in-up">
            <div className="card-body cin-confirmation">
              <div className="cin-success-icon">🎉</div>
              <h2 className="cin-success-title">Demande complète !</h2>
              <p className="cin-success-desc">
                Votre demande de Carte Nationale d'Identité <strong>#{demandeId}</strong> a été enregistrée avec succès.
              </p>

              <div className="cin-recap">
                <h3>📋 Récapitulatif</h3>
                <div className="cin-recap-row">
                  <span>Demandeur</span>
                  <span>{prenom} {nom}</span>
                </div>
                <div className="cin-recap-row">
                  <span>Type</span>
                  <span>Carte Nationale d'Identité</span>
                </div>
                <div className="cin-recap-row">
                  <span>Motif</span>
                  <span>{motif === 'premiere_demande' ? 'Première demande' : motif === 'renouvellement' ? 'Renouvellement' : 'Perte/Vol'}</span>
                </div>
                <div className="cin-recap-row">
                  <span>Rendez-vous</span>
                  <span>{rdvDate} à {rdvTime}</span>
                </div>
                <div className="cin-recap-row">
                  <span>Lieu</span>
                  <span>{rdvLocation}</span>
                </div>
                <div className="cin-recap-row">
                  <span>Paiement</span>
                  <span>75.00 MAD — {paymentMethod === 'carte' ? 'Carte' : paymentMethod === 'virement' ? 'Virement' : 'Espèces'}</span>
                </div>
              </div>

              <div className="cin-actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                  📊 Voir mon tableau de bord
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/demandes/${demandeId}`)}>
                  📋 Voir la demande
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
