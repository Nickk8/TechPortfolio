import { useState, useEffect } from 'react';
import { Link, useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import PortfolioCard from '../components/PortfolioCard';
import { fetchPortfolios, fetchUsuario } from '../services/api';

/* Webnode-style profile banner SVG */
function BannerSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 180" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bannerGrad" x1="0" y1="0" x2="800" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0057E0"/>
          <stop offset="50%" stopColor="#0073FF"/>
          <stop offset="100%" stopColor="#00C4FF"/>
        </linearGradient>
      </defs>
      <rect width="800" height="180" fill="url(#bannerGrad)"/>
      {/* Decorative circles */}
      <circle cx="680" cy="-20" r="160" fill="rgba(255,255,255,0.06)"/>
      <circle cx="750" cy="100" r="90" fill="rgba(255,255,255,0.04)"/>
      <circle cx="100" cy="180" r="120" fill="rgba(255,255,255,0.05)"/>
      {/* Grid dots */}
      {[0,1,2,3,4,5,6,7].map(col =>
        [0,1,2,3].map(row => (
          <circle
            key={`${col}-${row}`}
            cx={400 + col * 40 - 140}
            cy={40 + row * 40}
            r="1.5"
            fill="rgba(255,255,255,0.15)"
          />
        ))
      )}
      {/* Floating cards mockup */}
      <rect x="560" y="30" width="80" height="56" rx="10" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="568" y="38" width="64" height="28" rx="5" fill="rgba(255,255,255,0.08)"/>
      <rect x="568" y="72" width="40" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
      <rect x="568" y="80" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      <rect x="654" y="50" width="68" height="48" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <rect x="662" y="58" width="52" height="22" rx="4" fill="rgba(255,255,255,0.08)"/>
      <rect x="662" y="85" width="36" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
    </svg>
  );
}

function UsuarioPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(user || { nome: 'Visitante', username: 'usuario' });
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    if (user) {
      setUsuario(user);
    }
    fetchUsuario().then(data => {
      if (data) setUsuario(data);
    });
    fetchPortfolios().then(data => {
      if (data) setPortfolios(data.slice(0, 4));
    });
  }, [user]);

  const initials = usuario.nome
    ? usuario.nome
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const extras = [
    { label: 'Instituição', value: usuario.instituicao },
    { label: 'Curso', value: usuario.curso },
    { label: 'Ano / Série', value: usuario.anoSerie },
    { label: 'Cidade', value: usuario.cidade },
  ].filter(item => item.value);

  return (
    <div className="page-container animate-fade-in">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-banner">
          <BannerSVG />
        </div>

        <div className="profile-info-section">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="profile-name">{usuario.nome}</h1>
              <div className="profile-meta">
                <span style={{ color: 'var(--primary)' }}>@{usuario.username}</span>
                {usuario.email && (
                  <>
                    <span>•</span>
                    <span>{usuario.email}</span>
                  </>
                )}
              </div>
              {usuario.bio && <p className="profile-bio">{usuario.bio}</p>}
            </div>
            <button
              onClick={() => navigate('/criar')}
              style={{
                height: 38,
                padding: '0 18px',
                background: 'var(--primary-gradient)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,102,255,0.3)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              + Novo portfólio
            </button>
          </div>
        </div>

        {extras.length > 0 && (
          <div className="profile-stats-row">
            {extras.map(item => (
              <div className="stat-item" key={item.label}>
                <span className="stat-label">{item.label}</span>
                <span className="stat-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portfolios Section */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Meus portfólios</h2>
          <p className="section-subtitle">Projetos e trabalhos publicados.</p>
        </div>
        {portfolios.length > 0 && (
          <Link to="/portfolios" id="link-ver-todos" className="section-link">
            Ver todos →
          </Link>
        )}
      </div>

      {portfolios.length > 0 ? (
        <div className="portfolio-grid">
          {portfolios.map(p => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      ) : (
        <div className="profile-card">
          <div className="empty-state">
            {/* Webnode-style empty state illustration */}
            <div style={{ marginBottom: 20 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="#E8F2FF"/>
                <rect x="20" y="24" width="40" height="30" rx="6" fill="#B8D4FF" stroke="#0066FF" strokeWidth="1.5"/>
                <rect x="26" y="30" width="28" height="4" rx="2" fill="#0066FF" opacity="0.5"/>
                <rect x="26" y="38" width="20" height="3" rx="1.5" fill="#0066FF" opacity="0.35"/>
                <circle cx="40" cy="62" r="8" fill="#0066FF" opacity="0.1"/>
                <path d="M36 62h8M40 58v8" stroke="#0066FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Você ainda não criou nenhum portfólio</h3>
            <p>Comece agora, leva poucos minutos.</p>
            <button
              id="btn-criar-primeiro"
              type="button"
              className="btn-primary"
              style={{ marginTop: 20, width: 'auto', padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => navigate('/criar')}
            >
              Criar meu primeiro portfólio →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuarioPage;
