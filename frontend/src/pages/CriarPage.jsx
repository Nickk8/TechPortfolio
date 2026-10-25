import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortfolio } from '../services/api';

const CATEGORIES = [
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'pesquisa', label: 'Pesquisa acadêmica' },
  { value: 'design', label: 'Design' },
  { value: 'arte', label: 'Arte e Cultura' },
  { value: 'ciencias', label: 'Ciências' },
  { value: 'outro', label: 'Outro' },
];

const TYPES = [
  { value: 'projeto', label: 'Projeto' },
  { value: 'apresentacao', label: 'Apresentação' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'outro', label: 'Outro' },
];

function CriarPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const selectedCat = CATEGORIES.find(c => c.value === category)?.label || category || 'Tecnologia';
      const selectedType = TYPES.find(t => t.value === type)?.label || type || 'Projeto';
      await createPortfolio({
        title,
        description,
        category: selectedCat,
        type: selectedType,
      });
    } finally {
      setSubmitting(false);
      navigate('/portfolios');
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="criar-header">
        <h1 className="page-title">Criar portfólio</h1>
        <p className="page-subtitle">Adicione um novo projeto ao seu perfil profissional.</p>
      </div>

      <form id="criar-portfolio-form" onSubmit={handleSubmit}>
        <div className="criar-form-card">
          {/* Basic info */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: 'var(--text-primary)' }}>
              Informações básicas
            </h2>

            <div className="form-group">
              <label className="form-label" htmlFor="portfolio-title">
                Título do portfólio *
              </label>
              <input
                id="portfolio-title"
                type="text"
                className="form-input"
                placeholder="Ex: Desenvolvimento de Sistema de Gestão"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="portfolio-description">
                Descrição
              </label>
              <textarea
                id="portfolio-description"
                className="textarea-input"
                placeholder="Descreva seu projeto, objetivos, tecnologias utilizadas e resultados alcançados..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="portfolio-category">
                  Categoria
                </label>
                <select
                  id="portfolio-category"
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="portfolio-type">
                  Tipo de trabalho
                </label>
                <select
                  id="portfolio-type"
                  className="form-select"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload area */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
              Imagem de capa
            </h2>
            <div
              id="upload-zone"
              className="upload-zone"
              style={{ borderColor: isDragging ? 'var(--primary)' : undefined }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="upload-zone-icon">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <rect x="2" y="3" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 10l2.5-3 2 2.5 2-2.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="upload-zone-text">
                <strong style={{ color: 'var(--primary)' }}>Clique para enviar</strong> ou arraste e solte
              </p>
              <p className="upload-zone-sub">PNG, JPG, GIF até 10MB</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* Additional info */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
              Informações adicionais
            </h2>
            <div className="form-grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="portfolio-institution">
                  Instituição
                </label>
                <input
                  id="portfolio-institution"
                  type="text"
                  className="form-input"
                  placeholder="Colégio Estadual"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="portfolio-year">
                  Ano / Série
                </label>
                <input
                  id="portfolio-year"
                  type="text"
                  className="form-input"
                  placeholder="3º Ano"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              id="btn-cancelar-criar"
              type="button"
              className="btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button id="btn-publicar" type="submit" className="btn-primary">
              Publicar portfólio
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CriarPage;
