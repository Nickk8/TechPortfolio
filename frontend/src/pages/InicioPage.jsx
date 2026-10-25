import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioCard from '../components/PortfolioCard';
import { fetchPortfolios } from '../services/api';

function InicioPage() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetchPortfolios().then(data => {
      if (data) setPortfolios(data);
    });
  }, []);

  const totalLikes = portfolios.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalViews = portfolios.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="page-container animate-fade-in">
      {/* Hero banner */}
      <div
        style={{
          background: 'var(--primary-gradient-vibrant)',
          borderRadius: 20,
          padding: '36px 40px',
          marginBottom: 28,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: -40,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              opacity: 0.8,
              marginBottom: 8,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Bem-vindo de volta 👋
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
            Olá, Maria Silva!
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 500, lineHeight: 1.6 }}>
            Seu portfólio está ganhando visibilidade. Continue adicionando projetos para impressionar
            recrutadores e universidades.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            <button
              id="btn-criar-portfolio"
              onClick={() => navigate('/criar')}
              style={{
                height: 42,
                padding: '0 22px',
                background: '#fff',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              + Criar portfólio
            </button>
            <button
              id="btn-ver-perfil"
              onClick={() => navigate('/usuario')}
              style={{
                height: 42,
                padding: '0 22px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              Ver meu perfil
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: 'Portfólios publicados',
            value: portfolios.length || '8',
            icon: '📁',
            color: '#7B35E8',
          },
          {
            label: 'Curtidas recebidas',
            value: totalLikes || '388',
            icon: '❤️',
            color: '#ef4444',
          },
          {
            label: 'Visualizações',
            value: totalViews || '52',
            icon: '👁️',
            color: '#3B5BDB',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="profile-card"
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 0,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${stat.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Portfolios */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Portfólios em destaque</h2>
          <p className="section-subtitle">Mais visualizados esta semana.</p>
        </div>
      </div>

      <div className="portfolio-grid">
        {(portfolios.length > 4 ? portfolios.slice(4) : portfolios).map(p => (
          <PortfolioCard key={p.id} portfolio={p} />
        ))}
      </div>
    </div>
  );
}

export default InicioPage;
