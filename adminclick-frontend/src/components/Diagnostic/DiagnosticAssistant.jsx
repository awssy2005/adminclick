import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './DiagnosticAssistant.css';

const DiagnosticAssistant = ({ onClose }) => {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState('intro');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const pushStep = (nextStep, answerLabel) => {
    setHistory([...history, { step, answer: answerLabel }]);
    setStep(nextStep);
  };

  const goBack = () => {
    if (history.length === 0) {
      setStep('intro');
      return;
    }
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setStep(last.step);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/diagnostic', {
        responses: history,
        contact_email: formData.email,
        contact_phone: formData.phone,
        message: formData.message
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="diagnostic-result animate-fade-in">
          <div className="result-icon success">✓</div>
          <h3>{t('شكراً لك', 'Merci !')}</h3>
          <p>{t('لقد تم تسجيل طلبك. سيتصل بك خبيرنا في أقرب وقت ممكن.', 'Votre demande a été enregistrée. Notre expert vous contactera dans les plus brefs délais.')}</p>
          <button className="btn btn-primary" onClick={onClose}>{t('إغلاق', 'Fermer')}</button>
        </div>
      );
    }

    switch (step) {
      case 'intro':
        return (
          <div className="diagnostic-step animate-fade-in">
            <h3>{t('كيف يمكننا مساعدتك؟', 'Comment pouvons-nous vous aider ?')}</h3>
            <p>{t('أجب على بضع أسئلة لنوجهك إلى الحل الأنسب.', 'Répondez à quelques questions pour nous permettre de vous orienter vers la meilleure solution.')}</p>
            <div className="options-grid">
              <button className="option-card" onClick={() => pushStep('error_type', t('خطأ في وثيقتي الحالية', 'Erreur sur mon document actuel'))}>
                <span className="option-icon">✏️</span>
                <span className="option-label">{t('خطأ في وثيقتي الحالية', 'Erreur sur mon document actuel')}</span>
              </button>
              <button className="option-card" onClick={() => pushStep('special_request', t('طلب خاص (جنسية، عدول...)', 'Demande spécifique (Nationalité, Adoul...)'))}>
                <span className="option-icon">📜</span>
                <span className="option-label">{t('طلب خاص (جنسية، عدول...)', 'Demande spécifique (Nationalité, Adoul...)')}</span>
              </button>
              <button className="option-card" onClick={() => pushStep('contact_expert', t('مشكل آخر', 'Autre problème'))}>
                <span className="option-icon">❓</span>
                <span className="option-label">{t('مشكل آخر', 'Autre problème')}</span>
              </button>
            </div>
          </div>
        );

      case 'error_type':
        return (
          <div className="diagnostic-step animate-fade-in">
            <h3>{t('ما هو نوع الخطأ؟', 'Quel est le type d\'erreur ?')}</h3>
            <div className="options-list">
              <button className="option-item" onClick={() => pushStep('correction_needed', t('خطأ في الاسم، النسب أو تاريخ الازدياد', 'Erreur de nom, prénom ou date de naissance'))}>
                {t('خطأ في الاسم، النسب أو تاريخ الازدياد', 'Erreur de nom, prénom ou date de naissance')}
              </button>
              <button className="option-item" onClick={() => pushStep('contact_expert', t('خطأ معقد يتطلب مراجعة قضائية', 'Erreur complexe nécessitant une révision judiciaire'))}>
                {t('خطأ معقد يتطلب مراجعة قضائية', 'Erreur complexe nécessitant une révision judiciaire')}
              </button>
            </div>
          </div>
        );

      case 'correction_needed':
        return (
          <div className="diagnostic-result animate-fade-in">
            <div className="result-icon info">ℹ️</div>
            <h3>{t('تصحيح الحالة المدنية', 'Correction d\'état civil')}</h3>
            <p>{t('يمكن معالجة هذه الحالة عبر مسطرة التصحيح الإداري.', 'Cette situation peut être traitée via une procédure de correction administrative.')}</p>
            <p>{t('يرجى ترك بياناتك ليقوم خبيرنا بتوجيهك في الخطوات القانونية.', 'Veuillez laisser vos coordonnées pour qu\'un expert vous guide dans les démarches légales.')}</p>
            <button className="btn btn-primary" onClick={() => setStep('contact_expert')}>{t('متابعة', 'Continuer')}</button>
          </div>
        );

      case 'special_request':
        return (
          <div className="diagnostic-step animate-fade-in">
            <h3>{t('ما هو موضوع طلبك؟', 'Quel est l\'objet de votre demande ?')}</h3>
            <div className="options-grid">
              <button className="option-card" onClick={() => pushStep('nationality_info', t('الجنسية المغربية', 'Nationalité Marocaine'))}>
                <span className="option-icon">🇲🇦</span>
                <span className="option-label">{t('الجنسية المغربية', 'Nationalité Marocaine')}</span>
              </button>
              <button className="option-card" onClick={() => pushStep('adoul_info', t('خدمات العدول', 'Services Adoul'))}>
                <span className="option-icon">⚖️</span>
                <span className="option-label">{t('خدمات العدول', 'Services Adoul')}</span>
              </button>
            </div>
          </div>
        );

      case 'nationality_info':
        return (
          <div className="diagnostic-result animate-fade-in">
            <div className="result-icon info">ℹ️</div>
            <h3>{t('طلب الجنسية المغربية', 'Demande de Nationalité')}</h3>
            <p>{t('ملفات الجنسية تتطلب دراسة خاصة للوثائق الأصلية.', 'Les dossiers de nationalité nécessitent une étude approfondie des documents originaux.')}</p>
            <button className="btn btn-primary" onClick={() => setStep('contact_expert')}>{t('طلب استشارة خبير', 'Demander une consultation expert')}</button>
          </div>
        );

      case 'adoul_info':
        return (
          <div className="diagnostic-result animate-fade-in">
            <div className="result-icon info">ℹ️</div>
            <h3>{t('خدمات العدول', 'Services Adoul')}</h3>
            <p>{t('نحن نوفر الربط المباشر مع مكاتب العدول المعتمدة.', 'Nous assurons la mise en relation directe avec des bureaux d\'Adoul agréés.')}</p>
            <button className="btn btn-primary" onClick={() => setStep('contact_expert')}>{t('تواصل مع خبير', 'Contacter un expert')}</button>
          </div>
        );

      case 'contact_expert':
        return (
          <form className="diagnostic-form animate-fade-in" onSubmit={handleSubmit}>
            <h3>{t('تواصل مع خبير', 'Contactez un expert')}</h3>
            <p>{t('يرجى ملء الاستمارة وسنقوم بالرد عليك في أقرب وقت.', 'Veuillez remplir le formulaire et nous vous répondrons rapidement.')}</p>
            <div className="form-group">
              <label>{t('البريد الإلكتروني', 'Email')}</label>
              <input 
                type="email" 
                required 
                className="form-input" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>{t('الهاتف', 'Téléphone')}</label>
              <input 
                type="tel" 
                className="form-input" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>{t('رسالتك', 'Votre message')}</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? '...' : t('إرسال', 'Envoyer')}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="diagnostic-overlay">
      <div className="diagnostic-modal animate-scale-up">
        <div className="diagnostic-header">
          <div className="header-title">
            <span className="header-icon">🛡️</span>
            <h2>AdminClick Assistant</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="diagnostic-body">
          {renderContent()}
        </div>

        {step !== 'intro' && !success && (
          <div className="diagnostic-footer">
            <button className="back-link" onClick={goBack}>
              {lang === 'ar' ? '← العودة' : '← Retour'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticAssistant;
