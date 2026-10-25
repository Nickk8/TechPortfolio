import { useState, useEffect } from 'react';
import PortfolioCard from '../components/PortfolioCard';
import { fetchPortfolios } from '../services/api';

const CATEGORIES = ['Todos', 'Tecnologia', 'Pesquisa acadêmica', 'Design'];

function PortfoliosPage({ searchValue }) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    fetchPortfolios({ categoria: activeFilter, busca: searchValue })
      .then(data => {
        if (isCurrent) {
          setPortfolios(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeFilter, searchValue]);

  const filtered = portfolios;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Portfólios</h1>
        <p className="page-subtitle">Explore e gerencie todos os seus projetos publicados.</p>
      </div>

      {/* Filters */}
      <div className="portfolios-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            className={`filter-chip${activeFilter === cat ? ' active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            id="btn-ordenar"
            className="filter-chip"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Ordenar
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="portfolio-grid">
          {filtered.map(p => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      ) : (
        <div className="profile-card">
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <h3>Nenhum portfólio encontrado</h3>
            <p>Tente um filtro diferente ou crie um novo portfólio.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfoliosPage;
