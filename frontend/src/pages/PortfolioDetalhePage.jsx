import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '../router';
import { useAuth } from '../context/AuthContext';
import { fetchPortfolioById, likePortfolio } from '../services/api';

function PortfolioDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    fetchPortfolioById(id).then(data => {
      if (!isCurrent) return;
      if (data) {
        setPortfolio(data);
        setLikes(data.likes || 0);
      }
      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handlePrintPDF() {
    window.print();
  }

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes(prev => prev + 1);
    if (portfolio?.id) {
      await likePortfolio(portfolio.id);
    }
  }

  function handleShareWhatsApp() {
    const text = encodeURIComponent(`Confira meu portfólio digital: "${portfolio?.title}" no link: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function handleShareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        <h2 style={{ fontSize: 18, color: 'var(--text-primary)' }}>Carregando portfólio...</h2>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="page-container" style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
        <div className="profile-card" style={{ padding: '40px 24px' }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Portfólio não encontrado</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            O link pode estar expirado ou o ID informado não existe.
          </p>
          <button onClick={() => navigate('/portfolios')} className="btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
            Explorar outros portfólios
          </button>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="portfolio-detail-page">
      {/* ── Top Bar de Ações (Oculta na impressão do PDF) ── */}
      <div className="portfolio-action-header no-print">
        <div className="portfolio-action-container">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/portfolios')}
            className="action-btn-back"
          >
            ← Voltar
          </button>

          <div className="portfolio-action-group">
            {/* Botão Salvar em PDF */}
            <button
              type="button"
              id="btn-baixar-pdf"
              onClick={handlePrintPDF}
              className="action-btn-pdf"
              title="Salvar ou imprimir este portfólio em formato PDF"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 15 12 18 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Salvar em PDF</span>
            </button>

            {/* Botão Copiar Link */}
            <button
              type="button"
              id="btn-copiar-link"
              onClick={handleCopyLink}
              className={`action-btn-link ${copied ? 'copied' : ''}`}
              title="Copiar link compartilhável do portfólio"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{copied ? '✓ Link Copiado!' : 'Copiar Link'}</span>
            </button>

            {/* Compartilhar WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="action-btn-share"
              title="Compartilhar no WhatsApp"
            >
              <span>WhatsApp</span>
            </button>

            {/* Compartilhar LinkedIn */}
            <button
              type="button"
              onClick={handleShareLinkedIn}
              className="action-btn-share"
              title="Compartilhar no LinkedIn"
            >
              <span>LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Documento Oficial do Portfólio (Pronto para Visualização e PDF) ── */}
      <div className="portfolio-document-sheet">
        
        {/* Cabeçalho do PDF (Aparece no topo do documento) */}
        <div className="document-brand-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #0057E0 0%, #00C4FF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 13,
            }}>
              MP
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0D1B3E' }}>Meu Portfólio Digital</div>
              <div style={{ fontSize: 11, color: '#8D9BB5' }}>Plataforma Oficial de Conquistas</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge-verified">✓ DOCUMENTO OFICIAL</span>
            <div style={{ fontSize: 11, color: '#8D9BB5', marginTop: 4 }}>ID #{portfolio.id}</div>
          </div>
        </div>

        {/* Banner com Capa */}
        <div className="document-cover-wrap">
          <img
            src={portfolio.thumb || '/p1.svg'}
            alt={portfolio.title}
            className="document-cover-img"
          />
          <div className="document-cover-badges">
            {portfolio.category && <span className="doc-chip category">{portfolio.category}</span>}
            {portfolio.type && <span className="doc-chip type">{portfolio.type}</span>}
          </div>
        </div>

        {/* Título e Metadados Principais */}
        <div className="document-header-content">
          <h1 className="document-title">{portfolio.title}</h1>

          <div className="document-meta-row">
            {/* Informações do Autor */}
            <div className="document-author">
              <div className="author-avatar-circle">
                {(user?.nome || 'Estudante')[0].toUpperCase()}
              </div>
              <div>
                <div className="author-name">{user?.nome || 'Estudante Autor'}</div>
                <div className="author-sub">{user?.curso || 'Desenvolvimento e Tecnologia'} • {user?.instituicao || 'Ensino Médio / Técnico'}</div>
              </div>
            </div>

            {/* Estatísticas (Likes e Views) */}
            <div className="document-stats no-print">
              <button
                type="button"
                onClick={handleLike}
                className={`like-button-chip ${liked ? 'liked' : ''}`}
                title="Curtir este projeto"
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <strong>{likes}</strong> curtidas
              </button>
              <div className="stat-pill">
                <span>👁️</span> {portfolio.views || 1} acessos
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <hr className="document-divider" />

        {/* Corpo do Conteúdo */}
        <div className="document-body">
          <section className="document-section">
            <h2 className="section-heading">
              <span className="bullet-blue" />
              Sobre o Projeto
            </h2>
            <p className="section-paragraph">
              {portfolio.description ||
                'Este projeto foi estruturado com foco em boas práticas, inovação e resolução de desafios reais. Reúne conceitos técnicos, planejamento metodológico e resultados mensuráveis alcançados ao longo da execução.'}
            </p>
          </section>

          {/* Destaques Técnicos e Habilidades */}
          <section className="document-section">
            <h2 className="section-heading">
              <span className="bullet-blue" />
              Competências e Tecnologias Aplicadas
            </h2>
            <div className="document-skills-grid">
              {['Planejamento de Soluções', 'Resolução de Problemas', 'Inovação Digital', 'Trabalho em Equipe', 'Entrega de Resultados'].map(s => (
                <div key={s} className="skill-badge-item">
                  <span className="check-icon">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção de Validação e Compartilhamento */}
          <section className="document-section validation-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>
                  Link Público de Validação
                </h3>
                <p style={{ fontSize: 12.5, color: '#4A5568', margin: 0 }}>
                  Acesse este portfólio online em qualquer navegador através da URL direta:
                </p>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="document-link-text">
                  {currentUrl}
                </a>
              </div>

              <div className="no-print">
                <button type="button" onClick={handleCopyLink} className="btn-primary" style={{ height: 38, padding: '0 20px', fontSize: 13 }}>
                  {copied ? '✓ Link Copiado!' : 'Copiar URL'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé Oficial do Documento */}
        <div className="document-footer-bar">
          <div>
            Gerado pela plataforma <strong>Meu Portfólio</strong> • Inspirado no padrão digital Webnode
          </div>
          <div>
            Data de Emissão: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PortfolioDetalhePage;
