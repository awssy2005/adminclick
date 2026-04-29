import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../../api';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(() => {
        setServices([
          { id: 'acte_naissance', name: 'Acte de Naissance', description: 'Demandez une copie de votre acte de naissance', icon: 'birth', delay: '3-5 jours' },
          { id: 'certificat_residence', name: 'Certificat de Résidence', description: 'Obtenez un certificat de résidence officiel', icon: 'home', delay: '2-3 jours' },
          { id: 'carte_nationale', name: "Carte Nationale d'Identité", description: 'Demandez ou renouvelez votre carte nationale', icon: 'id', delay: '7-14 jours' },
          { id: 'extrait_casier', name: 'Extrait de Casier Judiciaire', description: 'Obtenez votre extrait de casier judiciaire', icon: 'legal', delay: '5-7 jours' },
          { id: 'attestation_travail', name: 'Attestation de Travail', description: 'Demandez une attestation de travail officielle', icon: 'work', delay: '2-4 jours' },
        ]);
      });
  }, []);

  const iconMap = {
    birth: '👶',
    home: '🏠',
    id: '🪪',
    legal: '⚖️',
    work: '💼',
  };

  const steps = [
    { num: '01', title: 'Créez votre compte', desc: 'Inscrivez-vous en quelques clics avec vos informations personnelles.' },
    { num: '02', title: 'Soumettez votre demande', desc: 'Remplissez le formulaire et joignez les documents nécessaires.' },
    { num: '03', title: 'Suivez l\'avancement', desc: 'Consultez l\'état de votre demande en temps réel depuis votre tableau de bord.' },
    { num: '04', title: 'Recevez votre document', desc: 'Téléchargez votre document une fois la demande validée.' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Plateforme officielle de démarches administratives
            </div>
            <h1 className="hero-title">
              Vos démarches
              <br />
              <span className="hero-title-gradient">simplifiées en un clic</span>
            </h1>
            <p className="hero-desc">
              Fini les files d'attente et la paperasse ! Effectuez toutes vos démarches administratives
              en ligne, suivez leur avancement et recevez vos documents directement.
            </p>
            <div className="hero-actions">
              <Link to={isAuthenticated ? '/cin' : '/register'} className="btn btn-accent btn-lg">
                🪪 Demande CIN en ligne
              </Link>
              <Link to={isAuthenticated ? '/demandes/create' : '/register'} className="btn btn-primary btn-lg">
                ✨ Faire une demande
              </Link>
              <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-secondary btn-lg">
                📋 Suivre ma demande
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">10K+</span>
                <span className="hero-stat-label">Utilisateurs</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-num">25K+</span>
                <span className="hero-stat-label">Demandes traitées</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-num">98%</span>
                <span className="hero-stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fade-in">
            <div className="hero-card-stack">
              <div className="hero-float-card card-1">
                <span className="float-icon">📄</span>
                <div>
                  <strong>Demande validée</strong>
                  <small>Acte de naissance</small>
                </div>
                <span className="badge badge-approved">✓ Validée</span>
              </div>
              <div className="hero-float-card card-2">
                <span className="float-icon">🔔</span>
                <div>
                  <strong>Notification</strong>
                  <small>Votre certificat est prêt</small>
                </div>
              </div>
              <div className="hero-float-card card-3">
                <span className="float-icon">📊</span>
                <div>
                  <strong>Progression</strong>
                  <div className="mini-progress">
                    <div className="mini-progress-bar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <span className="section-tag">Nos Services</span>
            <h2 className="section-title">Documents & Démarches disponibles</h2>
            <p className="section-desc">Accédez à l'ensemble de nos services administratifs en quelques clics</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div className="service-card card animate-fade-in-up" key={service.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card-body">
                  <div className="service-icon">{iconMap[service.icon] || '📄'}</div>
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-desc">{service.description}</p>
                  <div className="service-meta">
                    <span className="service-delay">⏱ {service.delay}</span>
                    <Link to={isAuthenticated ? '/demandes/create' : '/register'} className="service-link">
                      Demander →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <span className="section-tag">Comment ça marche</span>
            <h2 className="section-title">4 étapes simples</h2>
            <p className="section-desc">Un processus entièrement digitalisé, de la soumission à la réception</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div className="step-card animate-fade-in-up" key={step.num} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-num">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card animate-fade-in-up">
            <h2 className="cta-title">Prêt à simplifier vos démarches ?</h2>
            <p className="cta-desc">Rejoignez des milliers d'utilisateurs qui font déjà confiance à AdminClick</p>
            <Link to="/register" className="btn btn-primary btn-lg">Commencer maintenant →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-text">Admin<span className="logo-accent">Click</span></span>
            <p>Simplifiez vos démarches administratives en ligne.</p>
          </div>
          <div className="footer-links">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/services">Démarches</Link>
            <Link to="/login">Connexion</Link>
          </div>
          <div className="footer-links">
            <h4>Légal</h4>
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGU</a>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <a href="#">support@adminclick.ma</a>
            <a href="#">+212 5XX-XXXXXX</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 AdminClick. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
