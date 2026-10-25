import { useState } from 'react';
import { likePortfolio } from '../services/api';

function PortfolioCard({ portfolio }) {
  const [likes, setLikes] = useState(portfolio.likes ?? 0);
  const [liked, setLiked] = useState(false);

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

  return (
    <article className="portfolio-card" id={`portfolio-card-${portfolio.id}`}>
      <div className="portfolio-thumb">
        <img src={portfolio.thumb} alt={portfolio.title} loading="lazy" />
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
              color: liked ? '#ef4444' : 'inherit',
              padding: 0,
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
          <div className="stat-divider" style={{ borderColor: '#e5e7eb', borderRadius: '50%' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span>{portfolio.views}</span>
        </div>
      </div>
    </article>
  );
}

export default PortfolioCard;
