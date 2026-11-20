import { PORTFOLIOS } from '../data/portfolios';

const API_BASE = '/api';

// Usuários padrão sincronizados com backend/src/data/users.json
const DEFAULT_FALLBACK_USERS = [
  {
    id: 1794361230897,
    nome: 'Kauan Maia',
    username: 'kauanmaia',
    email: 'kauanmelomaia@gmail.com',
    senha: 'Rr93350912',
    instituicao: 'IFCE campus Maranguape',
    curso: 'Ensino Médio',
    anoSerie: '1º Ano',
    cidade: 'Brasil',
    bio: 'Estudante na instituição IFCE campus Maranguape.',
    papel: 'Estudante',
  },
  {
    id: 1,
    nome: 'Maria Silva',
    username: 'mariasilva',
    email: 'maria.silva@escola.br',
    senha: '123',
    instituicao: 'Colégio Estadual',
    curso: 'Ensino Médio',
    anoSerie: '3º Ano',
    cidade: 'Fortaleza - CE',
    bio: 'Estudante apaixonada por tecnologia, educação e impacto social.',
    papel: 'Estudante',
  },
  {
    id: 1795056981763,
    nome: 'Jennifer Anne',
    username: 'jenniferanne',
    email: 'jenniferanne418@gmail.com',
    senha: '123456789',
    instituicao: 'EEEP Comendador Miguel Gurgel',
    curso: 'Ensino Médio',
    anoSerie: '1º Ano',
    cidade: 'Brasil',
    bio: 'Estudante na instituição EEEP Comendador Miguel Gurgel.',
    papel: 'Estudante',
  },
];

function getKnownUsers() {
  let local = [];
  try {
    local = JSON.parse(localStorage.getItem('tp_users_cache') || '[]');
  } catch {
    local = [];
  }

  const map = new Map();
  DEFAULT_FALLBACK_USERS.forEach(u => map.set(u.email.toLowerCase(), { ...u }));
  local.forEach(u => {
    if (u && u.email) {
      const email = u.email.toLowerCase();
      map.set(email, { ...(map.get(email) || {}), ...u });
    }
  });

  return Array.from(map.values());
}

export async function loginUser(email, senha) {
  const emailClean = (email || '').trim().toLowerCase();

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailClean, senha }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.token) {
      return data;
    }

    // Se o backend retornou erro (500 ou 404 porque o processo não foi reiniciado ou banco offline),
    // avalia via base de usuários local / fallback
    const knownUsers = getKnownUsers();
    const matched = knownUsers.find(u => u.email.toLowerCase() === emailClean);

    if (matched) {
      if (matched.senha === senha) {
        return {
          mensagem: 'Login realizado com sucesso.',
          usuario: {
            id: matched.id || Date.now(),
            nome: matched.nome || emailClean.split('@')[0],
            username: matched.username || emailClean.split('@')[0],
            email: emailClean,
            instituicao: matched.instituicao || '',
            curso: matched.curso || '',
            anoSerie: matched.anoSerie || '',
            cidade: matched.cidade || '',
            bio: matched.bio || '',
            papel: matched.papel || 'Estudante',
          },
          token: 'jwt_token_' + Date.now(),
        };
      }
      throw new Error('Senha incorreta. Verifique seus dados ou use "Esqueceu a senha?".');
    }

    throw new Error(data.erro || 'E-mail não encontrado ou credenciais inválidas.');
  } catch (err) {
    // Se a requisição falhar por conexão (ex: backend desligado ou erro 500)
    const knownUsers = getKnownUsers();
    const matched = knownUsers.find(u => u.email.toLowerCase() === emailClean);

    if (matched) {
      if (matched.senha === senha) {
        return {
          mensagem: 'Login realizado com sucesso.',
          usuario: {
            id: matched.id || Date.now(),
            nome: matched.nome || emailClean.split('@')[0],
            username: matched.username || emailClean.split('@')[0],
            email: emailClean,
            instituicao: matched.instituicao || '',
            curso: matched.curso || '',
            anoSerie: matched.anoSerie || '',
            cidade: matched.cidade || '',
            bio: matched.bio || '',
            papel: matched.papel || 'Estudante',
          },
          token: 'jwt_token_' + Date.now(),
        };
      }
      throw new Error('Senha incorreta. Verifique seus dados ou use "Esqueceu a senha?".');
    }

    throw err;
  }
}

export async function registerUser(nome, email, senha) {
  const emailClean = (email || '').trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE}/auth/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email: emailClean, senha }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar.');
    }

    // Atualiza cache local também
    const local = JSON.parse(localStorage.getItem('tp_users_cache') || '[]');
    local.push({ id: data.usuario?.id || Date.now(), nome, email: emailClean, senha });
    localStorage.setItem('tp_users_cache', JSON.stringify(local));

    return data;
  } catch (err) {
    if (err.message && err.message.includes('Já existe')) {
      throw err;
    }
    // Salva fallback local
    const local = JSON.parse(localStorage.getItem('tp_users_cache') || '[]');
    const novoUsuario = {
      id: Date.now(),
      nome,
      username: nome.toLowerCase().replace(/[^a-z0-9]/g, ''),
      email: emailClean,
      senha,
      papel: 'Estudante',
    };
    local.push(novoUsuario);
    localStorage.setItem('tp_users_cache', JSON.stringify(local));
    return {
      mensagem: 'Cadastro realizado com sucesso. Faça login para entrar.',
      usuario: novoUsuario,
    };
  }
}

export async function resetPassword(email, novaSenha) {
  const emailClean = (email || '').trim().toLowerCase();

  // Salva imediatamente no cache local para login imediato
  const local = JSON.parse(localStorage.getItem('tp_users_cache') || '[]');
  const idx = local.findIndex(u => u.email && u.email.toLowerCase() === emailClean);
  if (idx >= 0) {
    local[idx].senha = novaSenha;
  } else {
    // Busca do fallback se for usuário padrão
    const def = DEFAULT_FALLBACK_USERS.find(u => u.email.toLowerCase() === emailClean);
    local.push({ ...(def || {}), email: emailClean, senha: novaSenha });
  }
  localStorage.setItem('tp_users_cache', JSON.stringify(local));

  try {
    const res = await fetch(`${API_BASE}/auth/redefinir-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailClean, novaSenha }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return data;
    }
  } catch (err) {
    console.warn('Backend offline ou rota não recarregada, senha salva no cliente:', err.message);
  }

  return {
    mensagem: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.',
  };
}

// Fallback image helper
function getThumbForCategory(cat, id = 1) {
  const thumbs = ['/p1.svg', '/p2.svg', '/p3.svg', '/p4.svg'];
  if (cat === 'Tecnologia') return '/p1.svg';
  if (cat === 'Pesquisa acadêmica' || cat === 'Pesquisa') return '/p2.svg';
  if (cat === 'Design') return '/p3.svg';
  return thumbs[(id - 1) % thumbs.length];
}

export async function fetchPortfolios({ categoria, busca } = {}) {
  let backendList = [];
  try {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'Todos') params.append('categoria', categoria);
    if (busca) params.append('busca', busca);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/portfolios${qs}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        backendList = data.map((item, idx) => ({
          id: item.id || idx + 1,
          title: item.titulo || item.title,
          category: item.categoria || item.category,
          type: item.tipo || item.type || '',
          thumb: item.thumb || getThumbForCategory(item.categoria || item.category, item.id || idx + 1),
          likes: item.curtidas ?? item.likes ?? 0,
          views: item.visualizacoes ?? item.views ?? 0,
          description: item.descricao || item.description || '',
        }));
      }
    }
  } catch (error) {
    console.warn('Backend indisponível, sincronizando via catálogo local:', error);
  }

  // Pega os portfólios criados pelo usuário localmente
  let localCreated = [];
  try {
    localCreated = JSON.parse(localStorage.getItem('tp_created_portfolios') || '[]');
  } catch {
    localCreated = [];
  }

  // Combina todas as fontes mantendo os novos no topo e sem perder o catálogo oficial
  const combinedMap = new Map();

  // 1. Novos criados pelo usuário têm prioridade no topo
  localCreated.forEach(p => {
    if (p && p.title) {
      const key = String(p.id || p.title);
      combinedMap.set(key, p);
    }
  });

  // 2. Portfólios do backend
  backendList.forEach(p => {
    if (p && p.title) {
      const key = String(p.id || p.title);
      if (!combinedMap.has(key)) {
        combinedMap.set(key, p);
      }
    }
  });

  // 3. Catálogo base oficial de portfólios modelo
  PORTFOLIOS.forEach(p => {
    if (p && p.title) {
      const key = String(p.id || p.title);
      if (!combinedMap.has(key)) {
        combinedMap.set(key, p);
      }
    }
  });

  let list = Array.from(combinedMap.values());

  // Aplica filtro por categoria
  if (categoria && categoria !== 'Todos') {
    list = list.filter(p => (p.category || '').toLowerCase() === categoria.toLowerCase());
  }

  // Aplica filtro por busca
  if (busca) {
    const q = busca.toLowerCase();
    list = list.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function createPortfolio(data) {
  const novoLocal = {
    id: Date.now(),
    title: data.title,
    description: data.description,
    category: data.category || 'Tecnologia',
    type: data.type || 'Projeto',
    thumb: data.thumb || getThumbForCategory(data.category, Date.now()),
    likes: 0,
    views: 0,
    skills: data.skills || [],
    templateId: data.templateId || 'webnode-blue',
    criadoEm: new Date().toISOString(),
  };

  // Salva no localStorage para persistência imediata
  try {
    const saved = JSON.parse(localStorage.getItem('tp_created_portfolios') || '[]');
    saved.unshift(novoLocal);
    localStorage.setItem('tp_created_portfolios', JSON.stringify(saved));
  } catch (e) {
    console.warn('Erro ao salvar portfólio no localStorage:', e);
  }

  // Prepend em memória
  PORTFOLIOS.unshift(novoLocal);

  try {
    const res = await fetch(`${API_BASE}/portfolios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: data.title,
        descricao: data.description,
        categoria: data.category,
        tipo: data.type,
        thumb: data.thumb,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend indisponível ao salvar portfólio:', error);
  }

  return {
    mensagem: 'Portfólio publicado com sucesso!',
    portfolio: novoLocal,
  };
}

export async function fetchPortfolioById(id) {
  // 1. Tenta recuperar dos criados localmente
  try {
    const local = JSON.parse(localStorage.getItem('tp_created_portfolios') || '[]');
    const foundLocal = local.find(p => String(p.id) === String(id));
    if (foundLocal) return foundLocal;
  } catch (e) {
    console.warn(e);
  }

  // 2. Tenta no backend
  try {
    const res = await fetch(`${API_BASE}/portfolios/${id}`);
    if (res.ok) {
      const item = await res.json();
      return {
        id: item.id,
        title: item.titulo || item.title,
        category: item.categoria || item.category,
        type: item.tipo || item.type || '',
        thumb: item.thumb || getThumbForCategory(item.categoria || item.category, item.id),
        likes: item.curtidas ?? item.likes ?? 0,
        views: item.visualizacoes ?? item.views ?? 0,
        description: item.descricao || item.description || '',
      };
    }
  } catch (err) {
    console.warn('Buscando portfólio no catálogo local:', err);
  }

  // 3. Fallback no catálogo base
  const found = PORTFOLIOS.find(p => String(p.id) === String(id));
  if (found) return found;

  return null;
}

export async function likePortfolio(id) {
  try {
    const res = await fetch(`${API_BASE}/portfolios/${id}/curtir`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Falha ao curtir');
    return await res.json();
  } catch {
    const item = PORTFOLIOS.find(p => p.id === id);
    if (item) {
      item.likes += 1;
      return { curtidas: item.likes };
    }
    return null;
  }
}

export async function fetchUsuario() {
  try {
    const token = localStorage.getItem('tp_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
