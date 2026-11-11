const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ─── User Storage ─────────────────────────────────────────────────
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

function getUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            const initial = [
                {
                    id: 1,
                    nome: 'Maria Silva',
                    username: 'mariasilva',
                    email: 'maria.silva@escola.br',
                    senha: '123',
                    papel: 'Estudante',
                    instituicao: 'Colégio Estadual',
                    curso: 'Ensino Médio',
                    anoSerie: '3º Ano',
                    cidade: 'Fortaleza - CE',
                    bio: 'Estudante apaixonada por tecnologia, educação e impacto social.',
                },
            ];
            fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
            fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
            return initial;
        }
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Erro ao ler usuários:', err);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error('Erro ao salvar usuários:', err);
    }
}

function sanitizeUser(user) {
    if (!user) return null;
    const { senha, ...safe } = user;
    return safe;
}

function formatUsername(name) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

// ─── Routes ───────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do TechPortfolio funcionando corretamente!',
        versao: '1.0.0',
        rotas: ['/api/usuarios', '/api/portfolios', '/api/auth/login', '/api/auth/cadastro'],
    });
});

// ─── Usuários ─────────────────────────────────────────────────────

// GET all users
app.get('/api/usuarios', (req, res) => {
    const users = getUsers();
    res.json(users.map(sanitizeUser));
});

// GET current user
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ erro: 'Não autenticado.' });
    }
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const parts = token.split('-');
    const userId = parts[1];
    const users = getUsers();
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(sanitizeUser(user));
});

// GET user by ID
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const users = getUsers();
    const user = users.find(u => String(u.id) === String(id));
    if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(sanitizeUser(user));
});

// POST register
app.post('/api/auth/cadastro', (req, res) => {
    const { nome, email, senha, instituicao } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const users = getUsers();
    const emailLower = email.trim().toLowerCase();
    const nomeTrim = nome.trim();

    const exists = users.find(u =>
        u.email.toLowerCase() === emailLower ||
        u.nome.toLowerCase() === nomeTrim.toLowerCase()
    );

    if (exists) {
        return res.status(400).json({ erro: 'Já existe um cadastro com este e-mail ou nome.' });
    }

    const baseUsername = formatUsername(nomeTrim) || 'usuario';
    let username = baseUsername;
    let counter = 1;
    while (users.some(u => u.username === username)) {
        username = `${baseUsername}${counter++}`;
    }

    const novoUsuario = {
        id: Date.now(),
        nome: nomeTrim,
        username,
        email: emailLower,
        senha: String(senha).trim(),
        instituicao: instituicao ? instituicao.trim() : 'Instituição de Ensino',
        curso: 'Ensino Médio',
        anoSerie: '1º Ano',
        cidade: 'Brasil',
        bio: `Estudante na instituição ${instituicao ? instituicao.trim() : 'Instituição de Ensino'}.`,
        papel: 'Estudante',
        criadoEm: new Date().toISOString(),
    };

    users.push(novoUsuario);
    saveUsers(users);

    res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso.',
        usuario: sanitizeUser(novoUsuario),
        token: 'token-' + novoUsuario.id + '-' + Date.now(),
    });
});

// POST login
app.post('/api/auth/login', (req, res) => {
    const { email, senha, login, nome, username } = req.body;
    const identifier = (email || login || nome || username || '').trim().toLowerCase();

    if (!identifier || !senha) {
        return res.status(400).json({ erro: 'Identificador (e-mail ou nome) e senha são obrigatórios.' });
    }

    const users = getUsers();
    const user = users.find(u =>
        u.email.toLowerCase() === identifier ||
        u.nome.toLowerCase() === identifier ||
        u.username.toLowerCase() === identifier
    );

    if (!user) {
        return res.status(401).json({ erro: 'Usuário não encontrado. Verifique seu e-mail/nome ou cadastre-se.' });
    }

    if (String(user.senha) !== String(senha).trim()) {
        return res.status(401).json({ erro: 'Senha incorreta. Tente novamente.' });
    }

    res.json({
        mensagem: 'Login realizado com sucesso.',
        usuario: sanitizeUser(user),
        token: 'token-' + user.id + '-' + Date.now(),
    });
});

// ─── Portfólios ───────────────────────────────────────────────────

const mockPortfolios = [
    { id: 1, titulo: 'Desenvolvimento de Sistema', categoria: 'Tecnologia', tipo: 'Projeto', curtidas: 24, visualizacoes: 3 },
    { id: 2, titulo: 'Pesquisa sobre IA', categoria: 'Pesquisa acadêmica', tipo: '', curtidas: 31, visualizacoes: 4 },
    { id: 3, titulo: 'Plano de Marketing', categoria: 'Design', tipo: 'Apresentação', curtidas: 38, visualizacoes: 5 },
    { id: 4, titulo: 'Tecnologia na Comunidade', categoria: 'Tecnologia', tipo: 'Projeto', curtidas: 45, visualizacoes: 6 },
    { id: 5, titulo: 'Estudo sobre Sustentabilidade', categoria: 'Pesquisa acadêmica', tipo: '', curtidas: 52, visualizacoes: 7 },
    { id: 6, titulo: 'Feira de Ciências', categoria: 'Design', tipo: 'Apresentação', curtidas: 59, visualizacoes: 8 },
    { id: 7, titulo: 'Relatório de Estágio', categoria: 'Tecnologia', tipo: 'Projeto', curtidas: 66, visualizacoes: 9 },
    { id: 8, titulo: 'Apresentação de Projeto', categoria: 'Pesquisa acadêmica', tipo: '', curtidas: 73, visualizacoes: 10 },
];

// GET all portfolios
app.get('/api/portfolios', (req, res) => {
    const { categoria, busca } = req.query;
    let result = [...mockPortfolios];

    if (categoria && categoria !== 'Todos') {
        result = result.filter(p => p.categoria === categoria);
    }

    if (busca) {
        const q = busca.toLowerCase();
        result = result.filter(p => p.titulo.toLowerCase().includes(q));
    }

    res.json(result);
});

// GET portfolio by ID
app.get('/api/portfolios/:id', (req, res) => {
    const { id } = req.params;
    const portfolio = mockPortfolios.find(p => p.id === Number(id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    res.json(portfolio);
});

// POST create portfolio
app.post('/api/portfolios', (req, res) => {
    const { titulo, descricao, categoria, tipo } = req.body;

    if (!titulo) {
        return res.status(400).json({ erro: 'Título é obrigatório.' });
    }

    const novo = {
        id: mockPortfolios.length + 1,
        titulo,
        descricao,
        categoria,
        tipo,
        curtidas: 0,
        visualizacoes: 0,
        criadoEm: new Date().toISOString(),
    };

    mockPortfolios.push(novo);
    res.status(201).json({ mensagem: 'Portfólio criado com sucesso.', portfolio: novo });
});

// PUT update portfolio
app.put('/api/portfolios/:id', (req, res) => {
    const { id } = req.params;
    const portfolio = mockPortfolios.find(p => p.id === Number(id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    Object.assign(portfolio, req.body);
    res.json({ mensagem: 'Portfólio atualizado.', portfolio });
});

// DELETE portfolio
app.delete('/api/portfolios/:id', (req, res) => {
    const { id } = req.params;
    const idx = mockPortfolios.findIndex(p => p.id === Number(id));

    if (idx === -1) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    mockPortfolios.splice(idx, 1);
    res.json({ mensagem: 'Portfólio removido com sucesso.' });
});

// POST curtir portfolio
app.post('/api/portfolios/:id/curtir', (req, res) => {
    const { id } = req.params;
    const portfolio = mockPortfolios.find(p => p.id === Number(id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    portfolio.curtidas += 1;
    res.json({ curtidas: portfolio.curtidas });
});

module.exports = app;