import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortfolioCard from '../components/PortfolioCard';
import { fetchPortfolios, fetchUsuario } from '../services/api';

function UsuarioPage() {
  const [usuario, setUsuario] = useState({
    nome: 'Maria Silva',
    username: 'mariasilva',
    instituicao: 'Colégio Estadual',
    curso: 'Ensino Médio',
    anoSerie: '3º Ano',
    cidade: 'Fortaleza - CE',
    bio: 'Estudante apaixonada por tecnologia, educação e impacto social.',
  });
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetchUsuario().then(data => {
      if (data) setUsuario(data);
    });
    fetchPortfolios().then(data => {
      if (data) setPortfolios(data.slice(0, 4));
    });
  }, []);

  const initials = usuario.nome
    ? usuario.nome
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MS';

  return (
    <div className="page-container animate-fade-in">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-banner">
          <img src="/banner.jpg" alt="Banner de perfil" />
        </div>

        <div className="profile-info-section">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
          </div>

          <h1 className="profile-name">{usuario.nome}</h1>
          <div className="profile-meta">
            <span style={{ color: 'var(--primary)' }}>@{usuario.username}</span>
            <span>•</span>
            <span>{usuario.papel || 'Ensino Médio Ativo'}</span>
          </div>
          <p className="profile-bio">{usuario.bio}</p>
        </div>

        <div className="profile-stats-row">
          <div className="stat-item">
            <span className="stat-label">Instituição</span>
            <span className="stat-value">{usuario.instituicao}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Curso</span>
            <span className="stat-value">{usuario.curso}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ano / Série</span>
            <span className="stat-value">{usuario.anoSerie}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cidade</span>
            <span className="stat-value">{usuario.cidade}</span>
          </div>
        </div>
      </div>

      {/* Portfolios Section */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Meus portfólios</h2>
          <p className="section-subtitle">Projetos e trabalhos publicados.</p>
        </div>
        <Link to="/portfolios" id="link-ver-todos" className="section-link">
          Ver todos →
        </Link>
      </div>

      <div className="portfolio-grid">
        {portfolios.map(p => (
          <PortfolioCard key={p.id} portfolio={p} />
        ))}
      </div>
    </div>
  );
}

export default UsuarioPage;
