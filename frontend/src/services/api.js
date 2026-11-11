import { PORTFOLIOS as FALLBACK_PORTFOLIOS } from '../data/portfolios';

const API_BASE = '/api';

export async function loginUser(email, senha) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.erro || 'Erro ao realizar login.');
    }
    return data;
  } catch (error) {
    if (error.message && error.message !== 'Failed to fetch') {
      throw error;
    }
    console.warn('Backend indisponível, simulando login local:', error);
    const saved = localStorage.getItem('tp_user');
    const localUser = saved ? JSON.parse(saved) : null;
    if (localUser && (localUser.email === email || localUser.nome === email)) {
      return {
        mensagem: 'Login realizado localmente',
        usuario: localUser,
        token: 'local-token-' + Date.now(),
      };
    }
    return {
      mensagem: 'Login realizado localmente',
      usuario: { id: 1, nome: email || 'Usuário', email, papel: 'Estudante' },
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
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar.');
    }
    return data;
  } catch (error) {
    if (error.message && error.message !== 'Failed to fetch') {
      throw error;
    }
    console.warn('Backend indisponível, simulando cadastro local:', error);
    const username = (nome || 'usuario').toLowerCase().replace(/[^a-z0-9]/g, '');
    return {
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        id: Date.now(),
        nome,
        username,
        email,
        instituicao: instituicao || 'Instituição de Ensino',
        curso: 'Ensino Médio',
        anoSerie: '1º Ano',
        cidade: 'Brasil',
        bio: `Estudante na instituição ${instituicao || 'Instituição de Ensino'}.`,
        papel: 'Estudante',
      },
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

export async function fetchUsuario(id) {
  try {
    const token = localStorage.getItem('tp_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const url = id ? `${API_BASE}/usuarios/${id}` : `${API_BASE}/auth/me`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Falha ao buscar usuário');
    return await res.json();
  } catch {
    const saved = localStorage.getItem('tp_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  }
}
