import { PORTFOLIOS as FALLBACK_PORTFOLIOS } from '../data/portfolios';

const API_BASE = '/api';

export async function loginUser(email, senha) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.erro || 'Erro ao realizar login.');
    }
    return await res.json();
  } catch (error) {
    console.warn('Backend indisponível, simulando login local:', error);
    return {
      mensagem: 'Login realizado localmente',
      usuario: { id: 1, nome: 'Maria Silva', email: email || 'maria.silva@escola.br', papel: 'Estudante' },
      token: 'local-token-' + Date.now(),
    };
  }
}

export async function registerUser(nome, email, senha, instituicao) {
  try {
    const res = await fetch(`${API_BASE}/auth/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, instituicao }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.erro || 'Erro ao cadastrar.');
    }
    return await res.json();
  } catch (error) {
    console.warn('Backend indisponível, simulando cadastro local:', error);
    return {
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: { id: 1, nome, email, papel: 'Estudante' },
      token: 'local-token-' + Date.now(),
    };
  }
}

export async function fetchPortfolios({ categoria, busca } = {}) {
  try {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'Todos') params.append('categoria', categoria);
    if (busca) params.append('busca', busca);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/portfolios${qs}`);
    if (!res.ok) throw new Error('Falha ao buscar portfólios');
    const data = await res.json();
    return data.map((item, index) => ({
      id: item.id,
      title: item.titulo || item.title,
      category: item.categoria || item.category,
      type: item.tipo || item.type || '',
      thumb: item.thumb || `/p${((item.id - 1) % 4) + 1}.jpg`,
      likes: item.curtidas ?? item.likes ?? 0,
      views: item.visualizacoes ?? item.views ?? 0,
      description: item.descricao || '',
    }));
  } catch (error) {
    console.warn('Erro ao conectar à API de portfólios, usando dados locais:', error);
    let result = [...FALLBACK_PORTFOLIOS];
    if (categoria && categoria !== 'Todos') {
      result = result.filter(p => p.category === categoria);
    }
    if (busca) {
      const q = busca.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    return result;
  }
}

export async function createPortfolio(data) {
  try {
    const res = await fetch(`${API_BASE}/portfolios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: data.title,
        descricao: data.description,
        categoria: data.category,
        tipo: data.type,
      }),
    });
    if (!res.ok) throw new Error('Falha ao criar portfólio');
    return await res.json();
  } catch (error) {
    console.warn('Erro ao conectar ao backend, simulando criação local:', error);
    return {
      mensagem: 'Portfólio criado localmente',
      portfolio: {
        id: Date.now(),
        titulo: data.title,
        categoria: data.category,
        tipo: data.type,
        curtidas: 0,
        visualizacoes: 0,
      },
    };
  }
}

export async function likePortfolio(id) {
  try {
    const res = await fetch(`${API_BASE}/portfolios/${id}/curtir`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Falha ao curtir');
    return await res.json();
  } catch (error) {
    console.warn('Erro ao curtir portfólio na API:', error);
    return null;
  }
}

export async function fetchUsuario(id = 1) {
  try {
    const res = await fetch(`${API_BASE}/usuarios/${id}`);
    if (!res.ok) throw new Error('Falha ao buscar usuário');
    return await res.json();
  } catch (error) {
    return {
      id: 1,
      nome: 'Maria Silva',
      username: 'mariasilva',
      email: 'maria.silva@escola.br',
      papel: 'Estudante',
      instituicao: 'Colégio Estadual',
      curso: 'Ensino Médio',
      anoSerie: '3º Ano',
      cidade: 'Fortaleza - CE',
      bio: 'Estudante apaixonada por tecnologia, educação e impacto social.',
    };
  }
}
