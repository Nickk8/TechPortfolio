const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do TechPortfolio funcionando corretamente!',
        versao: '1.0.0',
        rotas: ['/api/usuarios', '/api/portfolios'],
    });
});

// ─── Usuários ─────────────────────────────────────────────────────

// GET all users (mock)
app.get('/api/usuarios', (req, res) => {
    res.json([
        {
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
        },
    ]);
});

// GET user by ID
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        id: Number(id),
        nome: 'Maria Silva',
        username: 'mariasilva',
        email: 'maria.silva@escola.br',
        papel: 'Estudante',
        instituicao: 'Colégio Estadual',
        curso: 'Ensino Médio',
        anoSerie: '3º Ano',
        cidade: 'Fortaleza - CE',
        bio: 'Estudante apaixonada por tecnologia, educação e impacto social.',
    });
});

// POST register
app.post('/api/auth/cadastro', (req, res) => {
    const { nome, email, senha, instituicao } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso.',
        usuario: { id: 1, nome, email, papel: 'Estudante' },
        token: 'mock-jwt-token-' + Date.now(),
    });
});

// POST login
app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    // Mock authentication — accept any credentials
    res.json({
        mensagem: 'Login realizado com sucesso.',
        usuario: { id: 1, nome: 'Maria Silva', email, papel: 'Estudante' },
        token: 'mock-jwt-token-' + Date.now(),
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