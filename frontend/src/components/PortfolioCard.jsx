import { useState } from 'react';
import { useNavigate } from '../router';
import { likePortfolio } from '../services/api';

/* Webnode-style thumb placeholder SVG */
function ThumbPlaceholder({ title }) {
  const colors = ['#0066FF', '#00AAFF', '#00C4FF', '#0057E0'];
  const color = colors[Math.abs((title || '').charCodeAt(0) % colors.length)];
  const letter = (title || 'P')[0].toUpperCase();

  return (
    <svg width="100%" height="100%" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={`thumbGrad${letter}`} x1="0" y1="0" x2="260" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#00C4FF" stopOpacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="260" height="180" fill={`url(#thumbGrad${letter})`}/>
      <circle cx="220" cy="20" r="80" fill="rgba(255,255,255,0.07)"/>
      <circle cx="30" cy="150" r="60" fill="rgba(255,255,255,0.05)"/>
      <circle cx="130" cy="90" r="36" fill="rgba(255,255,255,0.15)"/>
      <text x="130" y="99" textAnchor="middle" fontSize="30" fontWeight="800" fill="white" fontFamily="Inter, sans-serif">{letter}</text>
    </svg>
  );
}

function PortfolioCard({ portfolio }) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(portfolio.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const tags = [portfolio.category, portfolio.type].filter(Boolean).join(' • ');

  async function handleLike(e) {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setLikes(prev => prev + 1);
    const res = await likePortfolio(portfolio.id);
    if (res?.curtidas) {
      setLikes(res.curtidas);
    }
  }

  function handleCardClick() {
    navigate(`/portfolio/${portfolio.id}`);
  }

  function handleCopyLink(e) {
    e.stopPropagation();
    const url = `${window.location.origin}/portfolio/${portfolio.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenPDF(e) {
    e.stopPropagation();
    navigate(`/portfolio/${portfolio.id}`);
  }

  return (
    <article
      className="portfolio-card"
      id={`portfolio-card-${portfolio.id}`}
      onClick={handleCardClick}
      title="Clique para ver o portfólio completo ou exportar em PDF"
    >
      <div className="portfolio-thumb" style={{ position: 'relative' }}>
        {portfolio.thumb
          ? <img src={portfolio.thumb} alt={portfolio.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : <ThumbPlaceholder title={portfolio.title}/>
        }
        {/* Category badge */}
        {portfolio.category && (
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            fontSize: 10.5,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
          }}>
            {portfolio.category}
          </span>
        )}

        {/* Quick action buttons on top right */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copiar link do portfólio"
            style={{
              height: 28,
              padding: '0 8px',
              borderRadius: 6,
              background: copied ? '#10B981' : 'rgba(10, 22, 40, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s',
            }}
          >
            <span>{copied ? '✓' : '🔗'}</span>
            <span>{copied ? 'Copiado!' : 'Link'}</span>
          </button>
        </div>
      </div>

      <div className="portfolio-card-body">
        <h3 className="portfolio-card-title">{portfolio.title}</h3>
        <p className="portfolio-card-tags">{tags}</p>

        <div className="portfolio-card-footer">
          <button
            type="button"
            className={`stat-chip heart ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Curtir portfólio"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: liked ? '#ef4444' : 'var(--text-muted)',
              padding: 0,
              transition: 'color 0.2s',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={liked ? '#ef4444' : 'none'}
              stroke={liked ? '#ef4444' : 'currentColor'}
              strokeWidth="1.8"
            >
              <path d="M12 21C12 21 3 14.5 3 8.5A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121 8.5c0 6-9 12.5-9 12.5z" />
            </svg>
            <span>{likes}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 13 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{portfolio.views}</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleOpenPDF}
              title="Abrir e Salvar em PDF"
              style={{
                background: 'rgba(0,102,255,0.08)',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              📄 PDF
            </button>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
              Ver →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PortfolioCard;
