import { useState } from 'react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';

const WEBNODE_TEMPLATES = [
  {
    id: 'tech',
    title: 'Tecnologia & Cloud',
    category: 'Tecnologia',
    type: 'Projeto',
    thumb: '/p1.svg',
    desc: 'Layout de alta performance para desenvolvedores, DevOps e engenheiros de software.',
    badge: 'Mais Popular',
  },
  {
    id: 'ai',
    title: 'Inteligência Artificial & Pesquisa',
    category: 'Pesquisa acadêmica',
    type: 'Pesquisa',
    thumb: '/p2.svg',
    desc: 'Foco em artigos, monografias, TCC e visualização de dados científicos.',
    badge: 'Acadêmico',
  },
  {
    id: 'design',
    title: 'Design UI/UX & Criativo',
    category: 'Design',
    type: 'Apresentação',
    thumb: '/p3.svg',
    desc: 'Visual moderno com cartões visuais para designers, ilustradores e criadores.',
    badge: 'Criativo',
  },
  {
    id: 'innovation',
    title: 'Inovação & Startups',
    category: 'Tecnologia',
    type: 'Projeto',
    thumb: '/p4.svg',
    desc: 'Apresente produtos digitais, pitch decks e projetos de alto impacto social.',
    badge: 'Inovação',
  },
];

const STEPS = [
  {
    num: '1',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: '1. Dê um nome ao projeto',
    text: 'Use nossa barra rápida de início para capturar o título e o objetivo do seu portfólio.',
  },
  {
    num: '2',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    ),
    title: '2. Escolha o modelo visual',
    text: 'Selecione entre templates profissionais inspirados no padrão Webnode.',
  },
  {
    num: '3',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: '3. Adicione suas conquistas',
    text: 'Preencha habilidades, links, fotos e documentos com o assistente passo a passo.',
  },
  {
    num: '4',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: '4. Publique e compartilhe',
    text: 'Gere um link oficial instantâneo para colocar no currículo, LinkedIn e enviar a recrutadores.',
  },
];

const FAQ = [
  {
    q: 'Como funciona o método de criação inspirado no Webnode?',
    a: 'Você digita o nome do seu portfólio diretamente na barra inicial e nosso assistente guia você em 4 passos rápidos: definição da categoria, detalhes do projeto, escolha de template e visualização em tempo real antes de publicar.',
  },
  {
    q: 'Preciso saber programar para criar um portfólio?',
    a: 'Não. O sistema organiza suas informações e cria automaticamente um layout profissional pronto para compartilhar.',
  },
  {
    q: 'Posso usar imagens personalizadas no meu portfólio?',
    a: 'Sim. Você pode escolher nossas capas modernas com estética Webnode ou fazer upload de fotos dos seus próprios projetos.',
  },
  {
    q: 'Como funciona o link público do portfólio?',
    a: 'Assim que você publica, um link único é gerado. Qualquer pessoa com o link pode visualizar suas conquistas sem precisar criar conta.',
  },
  {
    q: 'Posso editar meu portfólio depois de publicado?',
    a: 'Sim, a qualquer momento você pode atualizar informações, trocar imagens e adicionar novas conquistas.',
  },
];

function InicioPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quickTitle, setQuickTitle] = useState('');
  const firstName = user?.nome ? user.nome.split(' ')[0] : 'por aqui';

  function handleQuickStart(e) {
    e.preventDefault();
    const titleParam = quickTitle.trim() ? `?title=${encodeURIComponent(quickTitle.trim())}` : '';
    navigate(`/criar${titleParam}`);
  }

  function handleSelectTemplate(tmpl) {
    const params = new URLSearchParams({
      title: tmpl.title,
      category: tmpl.category,
      type: tmpl.type,
      thumb: tmpl.thumb,
    });
    navigate(`/criar?${params.toString()}`);
  }

  return (
    <div className="page-container animate-fade-in">
      {/* ── Webnode Hero Section com Barra de Captação Rápida ── */}
      <div className="webnode-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginBottom: 16,
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
            }}>
              <span>⚡</span> Método Inteligente Webnode
            </span>

            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 12, lineHeight: 1.15, letterSpacing: '-0.5px', color: '#fff' }}>
              Olá, {firstName}! Crie seu portfólio profissional em minutos.
            </h1>

            <p style={{ fontSize: 15, opacity: 0.9, maxWidth: 480, lineHeight: 1.6, color: '#fff', marginBottom: 24 }}>
              Destaque seus projetos, habilidades e conquistas acadêmicas com o visual moderno e templates comprovados do Webnode.
            </p>

            {/* ── Webnode Quick Lead / Information Capture Form ── */}
            <form onSubmit={handleQuickStart} style={{ maxWidth: 480, marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                background: '#fff',
                borderRadius: 12,
                padding: '6px',
                boxShadow: '0 8px 30px rgba(0, 43, 122, 0.25)',
                gap: 8,
              }}>
                <input
                  type="text"
                  placeholder="Nome do seu portfólio (ex: Meu Portfólio Tech)..."
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '0 14px',
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    height: 44,
                    padding: '0 20px',
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                    boxShadow: '0 4px 12px rgba(0,102,255,0.3)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0052CC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                >
                  Começar Grátis →
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.5, opacity: 0.92, color: '#fff' }}>
              <span>✓ Sem código necessário</span>
              <span>✓ Link público e PDF</span>
              <span>✓ 100% Gratuito</span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, width: '100%', maxWidth: 320 }}>
            <img
              src="/students.svg"
              alt="Plataforma de criação Webnode"
              style={{ width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 12px 36px rgba(0,0,0,0.25)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Métricas e Prova Social (Webnode Style) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Portfólios Criados', value: '1.240+', icon: '🚀', trend: '+18% este mês' },
          { label: 'Estudantes Ativos', value: '860+', icon: '👥', trend: 'Comunidade engajada' },
          { label: 'Visualizações de Recrutadores', value: '14.8K', icon: '👁️', trend: 'Oportunidades geradas' },
          { label: 'Avaliação Média', value: '4.9 ★', icon: '⭐', trend: 'Baseado em 500+ feedbacks' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#fff',
            borderRadius: 14,
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(0, 102, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: '#E8F9F0', padding: '2px 8px', borderRadius: 10 }}>
                {item.trend}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
              {item.value}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Galeria de Modelos Prontos (O método de escolha Webnode) ── */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="section-title">Escolha um Modelo Webnode</h2>
          <p className="section-subtitle">Comece imediatamente com um design pré-configurado e personalizado para a sua área.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 36 }}>
        {WEBNODE_TEMPLATES.map(tmpl => (
          <div
            key={tmpl.id}
            className="portfolio-card"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div className="portfolio-thumb" style={{ position: 'relative' }}>
              <img src={tmpl.thumb} alt={tmpl.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <span style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                boxShadow: '0 2px 8px rgba(0,102,255,0.4)',
              }}>
                {tmpl.badge}
              </span>
            </div>
            <div className="portfolio-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 className="portfolio-card-title">{tmpl.title}</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, flex: 1 }}>
                {tmpl.desc}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleSelectTemplate(tmpl)}
                style={{ height: 38, fontSize: 13, marginTop: 'auto' }}
              >
                Usar este modelo →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Como funciona em 4 passos ── */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Como funciona a criação</h2>
          <p className="section-subtitle">Passo a passo simplificado para estruturar sua presença profissional.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
        {STEPS.map(step => (
          <div key={step.num} className="step-card">
            <div className="step-card-number">{step.num}</div>
            <div style={{ color: 'var(--primary)', marginBottom: 10 }}>{step.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {step.title}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {step.text}
            </div>
          </div>
        ))}
      </div>

      {/* ── FAQ ── */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Perguntas Frequentes</h2>
          <p className="section-subtitle">Dúvidas comuns sobre o método Webnode de portfólios.</p>
        </div>
      </div>

      <div className="profile-card faq-card" style={{ padding: '8px 24px' }}>
        {FAQ.map(item => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default InicioPage;
