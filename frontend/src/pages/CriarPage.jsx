import { useState, useEffect } from 'react';
import { useNavigate } from '../router';
import { createPortfolio } from '../services/api';

const CATEGORIES = [
  {
    id: 'Tecnologia',
    title: 'Tecnologia & Desenvolvimento',
    icon: '💻',
    desc: 'Softwares, sites, APIs, aplicativos mobile e infraestrutura cloud.',
    defaultThumb: '/p1.svg',
  },
  {
    id: 'Pesquisa acadêmica',
    title: 'Pesquisa & Ciência',
    icon: '🔬',
    desc: 'Artigos acadêmicos, monografias, TCC, dados e experimentos.',
    defaultThumb: '/p2.svg',
  },
  {
    id: 'Design',
    title: 'Design UI/UX & Criação',
    icon: '🎨',
    desc: 'Interfaces, identidade visual, ilustração, branding e protótipos.',
    defaultThumb: '/p3.svg',
  },
  {
    id: 'Inovação',
    title: 'Inovação & Startups',
    icon: '🚀',
    desc: 'Projetos empreendedores, novos modelos de negócio e impacto social.',
    defaultThumb: '/p4.svg',
  },
];

const SKILL_SUGGESTIONS = [
  'React', 'JavaScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'TypeScript',
  'Banco de Dados', 'API REST', 'Machine Learning', 'Metodologia Ágil', 'Cloud / AWS',
  'Artigo Científico', 'TCC', 'Design Gráfico', 'Mobile App',
];

const TEMPLATES = [
  {
    id: 'webnode-blue',
    name: 'Webnode Modern Blue',
    badge: 'Padrão Oficial',
    border: '#0066FF',
    accent: 'linear-gradient(135deg, #0057E0 0%, #00C4FF 100%)',
    bgPreview: '#F0F4FF',
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimalist',
    badge: 'Elegante',
    border: '#CBD5E8',
    accent: 'linear-gradient(135deg, #4A5568 0%, #A0AEC0 100%)',
    bgPreview: '#FFFFFF',
  },
  {
    id: 'creative-gradient',
    name: 'Creative Vibrant',
    badge: 'Criativo',
    border: '#6C47FF',
    accent: 'linear-gradient(135deg, #6C47FF 0%, #00D9C0 100%)',
    bgPreview: '#F8F5FF',
  },
  {
    id: 'dark-cyber',
    name: 'Dark Cyber Tech',
    badge: 'Sofisticado',
    border: '#00C4FF',
    accent: 'linear-gradient(135deg, #0A1628 0%, #003580 100%)',
    bgPreview: '#0A1628',
  },
];

const COVERS = [
  { url: '/p1.svg', label: 'Tecnologia & Cloud' },
  { url: '/p2.svg', label: 'IA & Pesquisa' },
  { url: '/p3.svg', label: 'Design UI/UX' },
  { url: '/p4.svg', label: 'Inovação & Métricas' },
];

function CriarPage() {
  const navigate = useNavigate();

  // Multi-step state (Passo 1 a 4)
  const [step, setStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tecnologia');
  const [type, setType] = useState('Projeto');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'JavaScript']);
  const [selectedTemplate, setSelectedTemplate] = useState('webnode-blue');
  const [coverUrl, setCoverUrl] = useState('/p1.svg');
  const [customCover, setCustomCover] = useState(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Pre-fill from URL params (from InicioPage quick capture)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTitle = params.get('title');
      const urlCategory = params.get('category');
      const urlType = params.get('type');
      const urlThumb = params.get('thumb');

      if (urlTitle) setTitle(urlTitle);
      if (urlCategory) setCategory(urlCategory);
      if (urlType) setType(urlType);
      if (urlThumb) setCoverUrl(urlThumb);
    }
  }, []);

  function toggleSkill(skill) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomCover(url);
      setCoverUrl(url);
    }
  }

  async function handlePublish() {
    if (!title.trim()) {
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const created = await createPortfolio({
        title,
        description: description || subtitle,
        category,
        type,
        thumb: coverUrl,
      });

      const portfolioId = created?.portfolio?.id || Date.now();
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      const fullUrl = `${origin}/portfolio/${portfolioId}`;

      setPublishedData({
        ...created?.portfolio,
        id: portfolioId,
        link: fullUrl,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopy() {
    if (publishedData?.link) {
      navigator.clipboard.writeText(publishedData.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }

  // ── Success State Screen (Webnode Success Flow) ──
  if (publishedData) {
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: 720, margin: '40px auto' }}>
        <div className="profile-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #00C4FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#fff', margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
          }}>
            ✓
          </div>

          <span style={{
            display: 'inline-block',
            background: '#E8F9F0',
            color: '#10B981',
            fontWeight: 700,
            fontSize: 12,
            padding: '4px 14px',
            borderRadius: 20,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}>
            PUBLICADO COM SUCESSO
          </span>

          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            Seu Portfólio Está Pronto!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Seu projeto foi gerado e agora você pode compartilhá-lo via link público ou salvá-lo em formato PDF para anexar em processos seletivos.
          </p>

          {/* Share Link Box */}
          <div style={{
            background: '#F0F4FF',
            border: '1.5px solid #CBD5E8',
            borderRadius: 12,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 28,
            textAlign: 'left',
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Link Oficial do Portfólio</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {publishedData.link}
              </div>
            </div>
            <button
              onClick={handleCopy}
              style={{
                height: 38,
                padding: '0 18px',
                background: copiedLink ? '#10B981' : 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
            >
              {copiedLink ? '✓ Copiado!' : 'Copiar Link'}
            </button>
          </div>

          {/* Action buttons (Salvar PDF, Acessar via Link, Feed) */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/portfolio/${publishedData.id}`)}
              className="btn-primary"
              style={{ width: 'auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>🔗 Abrir Portfólio via Link</span>
            </button>

            <button
              onClick={() => {
                navigate(`/portfolio/${publishedData.id}`);
                setTimeout(() => window.print(), 500);
              }}
              style={{
                height: 48,
                padding: '0 24px',
                background: '#0A1628',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
              }}
            >
              <span>📄 Salvar em PDF</span>
            </button>

            <button
              onClick={() => navigate('/portfolios')}
              className="btn-outline"
              style={{ height: 48, padding: '0 20px', borderRadius: 12 }}
            >
              Ver Todos os Portfólios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* ── Header Webnode ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--primary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 18,
            boxShadow: '0 4px 14px rgba(0,102,255,0.3)',
          }}>
            ✦
          </div>
          <div>
            <h1 className="page-title">Assistente de Captação &amp; Criação Webnode</h1>
            <p className="page-subtitle">Configure seu portfólio profissional em 4 etapas guiadas.</p>
          </div>
        </div>

        {/* ── Webnode Progress Bar ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginTop: 20,
          background: '#fff',
          padding: '16px 20px',
          borderRadius: 14,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(0,102,255,0.08)',
        }}>
          {[
            { n: 1, label: '1. Categoria' },
            { n: 2, label: '2. Conteúdo' },
            { n: 3, label: '3. Template' },
            { n: 4, label: '4. Capa & Preview' },
          ].map(s => {
            const isActive = step === s.n;
            const isDone = step > s.n;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '6px 8px',
                  borderRadius: 8,
                  backgroundColor: isActive ? 'rgba(0,102,255,0.06)' : 'transparent',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: isDone ? '#10B981' : isActive ? 'var(--primary)' : '#CBD5E8',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'var(--transition)',
                }}>
                  {isDone ? '✓' : s.n}
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Two-Column Layout (Form Wizard + Live Webnode Preview) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        
        {/* Wizard Card Left */}
        <div className="criar-form-card" style={{ maxWidth: '100%' }}>
          
          {/* ── PASSO 1: Categoria & Objetivo ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Passo 1: Qual é o foco do seu portfólio?
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>
                Selecione a área principal. O Webnode otimiza as seções e palavras-chave de acordo com a sua escolha.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setCoverUrl(cat.defaultThumb);
                      }}
                      style={{
                        padding: '18px',
                        borderRadius: 14,
                        border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--input-border)',
                        background: isSelected ? 'rgba(0, 102, 255, 0.04)' : '#fff',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: isSelected ? '0 4px 16px rgba(0, 102, 255, 0.12)' : 'none',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {cat.title}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {cat.desc}
                      </div>
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'var(--primary)', color: '#fff',
                          fontSize: 11, fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(2)}
                  style={{ width: 'auto', padding: '0 32px' }}
                >
                  Continuar para Conteúdo →
                </button>
              </div>
            </div>
          )}

          {/* ── PASSO 2: Conteúdo & Detalhes ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Passo 2: Informações e Conteúdo Principal
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>
                Insira o título, subtítulo e as principais habilidades que você quer apresentar.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="inp-title">
                  Título do Portfólio / Projeto *
                </label>
                <input
                  id="inp-title"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Desenvolvimento de Sistema Cloud & Web"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inp-subtitle">
                  Slogan ou Subtítulo de Impacto
                </label>
                <input
                  id="inp-subtitle"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Solução escalável de alta performance para grandes equipes"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inp-desc">
                  Descrição detalhada do projeto
                </label>
                <textarea
                  id="inp-desc"
                  className="textarea-input"
                  rows={4}
                  placeholder="Explique os objetivos, tecnologias utilizadas, desafios superados e o impacto alcançado..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* Skills multi-select chips */}
              <div className="form-group">
                <label className="form-label">
                  Tecnologias e Competências Chave (clique para selecionar)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {SKILL_SUGGESTIONS.map(skill => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          height: 32,
                          padding: '0 14px',
                          borderRadius: 20,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--input-border)',
                          background: active ? 'var(--primary)' : '#fff',
                          color: active ? '#fff' : 'var(--text-secondary)',
                        }}
                      >
                        {active ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tipo de Trabalho</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Projeto">Projeto</option>
                    <option value="Pesquisa">Pesquisa</option>
                    <option value="Apresentação">Apresentação</option>
                    <option value="Relatório">Relatório</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Instituição ou Empresa</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: USP, SENAI, Startup X..."
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setStep(1)}
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  style={{ width: 'auto', padding: '0 32px' }}
                >
                  Continuar para Templates →
                </button>
              </div>
            </div>
          )}

          {/* ── PASSO 3: Template Visual Webnode ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Passo 3: Escolha o Estilo Visual do Webnode
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>
                Selecione o esquema de cores e estilo de layout para destacar seu portfólio.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16, marginBottom: 28 }}>
                {TEMPLATES.map(tmpl => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      style={{
                        borderRadius: 14,
                        border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--input-border)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: isSelected ? '0 6px 20px rgba(0, 102, 255, 0.18)' : 'none',
                        background: '#fff',
                      }}
                    >
                      {/* Gradient Header preview */}
                      <div style={{ height: 48, background: tmpl.accent, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 10 }}>
                          {tmpl.badge}
                        </span>
                        {isSelected && (
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: 'var(--primary)', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ✓
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {tmpl.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Tipografia moderna, cards responsivos e botões com gradiente.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setStep(2)}
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(4)}
                  style={{ width: 'auto', padding: '0 32px' }}
                >
                  Continuar para Capa &amp; Publicação →
                </button>
              </div>
            </div>
          )}

          {/* ── PASSO 4: Imagem de Capa & Publicação ── */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Passo 4: Capa &amp; Confirmação de Publicação
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>
                Selecione uma das nossas ilustrações vetoriais Webnode oficiais ou envie uma imagem personalizada.
              </p>

              {/* Curated Webnode Covers */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Ilustrações Webnode recomendadas</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 8 }}>
                  {COVERS.map(c => {
                    const isSelected = coverUrl === c.url;
                    return (
                      <div
                        key={c.url}
                        onClick={() => setCoverUrl(c.url)}
                        style={{
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: isSelected ? '2.5px solid var(--primary)' : '1.5px solid var(--input-border)',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          position: 'relative',
                        }}
                      >
                        <img src={c.url} alt={c.label} style={{ width: '100%', height: 75, objectFit: 'cover' }} />
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-primary)', padding: '4px', textAlign: 'center', background: '#F8FAFF' }}>
                          {c.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label">Ou envie sua própria imagem</label>
                <div
                  className="upload-zone"
                  onClick={() => document.getElementById('cover-file-input').click()}
                  style={{ padding: '24px', marginTop: 8 }}
                >
                  <p className="upload-zone-text">
                    <strong style={{ color: 'var(--primary)' }}>Clique para enviar foto</strong> ou arraste um arquivo
                  </p>
                  <p className="upload-zone-sub">PNG, JPG, SVG até 10MB</p>
                </div>
                <input
                  id="cover-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setStep(3)}
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePublish}
                  disabled={submitting}
                  style={{ width: 'auto', padding: '0 36px', fontSize: 14 }}
                >
                  {submitting ? 'Publicando...' : '🚀 Publicar Portfólio Webnode'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Right Column: Live Real-Time Card Preview (Webnode Signature) ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(0,102,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                👁️ Live Preview
              </span>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: '#E8F9F0', padding: '2px 8px', borderRadius: 10 }}>
                Atualização em tempo real
              </span>
            </div>

            {/* The Actual Simulated Portfolio Card */}
            <div className="portfolio-card" style={{ marginBottom: 16, border: '1.5px solid rgba(0,102,255,0.15)' }}>
              <div className="portfolio-thumb" style={{ height: 160, position: 'relative' }}>
                <img src={coverUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                }}>
                  {category}
                </span>
              </div>
              <div className="portfolio-card-body">
                <h3 className="portfolio-card-title" style={{ fontSize: 14, minHeight: 20 }}>
                  {title || 'Título do seu portfólio...'}
                </h3>
                <p className="portfolio-card-tags">
                  {type} • {category}
                </p>
                {selectedSkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {selectedSkills.slice(0, 3).map(s => (
                      <span key={s} style={{ fontSize: 10, background: 'rgba(0,102,255,0.08)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                    {selectedSkills.length > 3 && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{selectedSkills.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="portfolio-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>❤️</span> 1
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>👁️</span> 1
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>
                    Ver Projeto →
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <div style={{ borderTop: '1px solid #E8F0FF', paddingTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Checklist de Conclusão:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: title ? '#10B981' : 'var(--text-muted)' }}>
                  <span>{title ? '✓' : '○'}</span> Título definido
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: category ? '#10B981' : 'var(--text-muted)' }}>
                  <span>{category ? '✓' : '○'}</span> Categoria escolhida
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: selectedSkills.length > 0 ? '#10B981' : 'var(--text-muted)' }}>
                  <span>{selectedSkills.length > 0 ? '✓' : '○'}</span> Habilidades selecionadas ({selectedSkills.length})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: coverUrl ? '#10B981' : 'var(--text-muted)' }}>
                  <span>{coverUrl ? '✓' : '○'}</span> Capa Webnode ativa
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CriarPage;
