require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ─── Autenticação (cadastro, login, /me) ──────────────────────────
app.use('/api/auth', require('./auth'));

// ─── Rotas ────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do TechPortfolio funcionando corretamente!',
        versao: '1.0.0',
        rotas: ['/api/portfolios', '/api/auth/login', '/api/auth/cadastro', '/api/auth/me'],
    });
});

// ─── Portfólios (catálogo base Webnode + novos criados) ─────────

const BASE_PORTFOLIOS = [
    {
        id: 1,
        titulo: 'Desenvolvimento de Sistema Cloud & Web',
        categoria: 'Tecnologia',
        tipo: 'Projeto',
        thumb: '/p1.svg',
        curtidas: 42,
        visualizacoes: 128,
        descricao: 'Arquitetura moderna escalável com APIs RESTful, interface responsiva e deploys automatizados.',
    },
    {
        id: 2,
        titulo: 'Pesquisa Aplicada sobre IA e Machine Learning',
        categoria: 'Pesquisa acadêmica',
        tipo: 'Pesquisa',
        thumb: '/p2.svg',
        curtidas: 58,
        visualizacoes: 215,
        descricao: 'Estudo experimental com modelos neurais preditivos aplicados ao diagnóstico de dados complexos.',
    },
    {
        id: 3,
        titulo: 'Design System & Experiência UI/UX Webnode',
        categoria: 'Design',
        tipo: 'Apresentação',
        thumb: '/p3.svg',
        curtidas: 67,
        visualizacoes: 340,
        descricao: 'Criação de identidade visual moderna, protótipos de alta fidelidade e biblioteca de componentes reutilizáveis.',
    },
    {
        id: 4,
        titulo: 'Inovação e Plataforma para a Comunidade',
        categoria: 'Tecnologia',
        tipo: 'Projeto',
        thumb: '/p4.svg',
        curtidas: 85,
        visualizacoes: 412,
        descricao: 'Solução digital de alto impacto social conectando estudantes e mentores da área de tecnologia.',
    },
    {
        id: 5,
        titulo: 'Estudo sobre Cidades Inteligentes e Sustentabilidade',
        categoria: 'Pesquisa acadêmica',
        tipo: 'Relatório',
        thumb: '/p2.svg',
        curtidas: 39,
        visualizacoes: 180,
        descricao: 'Análise de métricas urbanas e eficiência energética com automação de sensores IoT.',
    },
    {
        id: 6,
        titulo: 'Identidade Criativa para Startup Tech',
        categoria: 'Design',
        tipo: 'Projeto',
        thumb: '/p3.svg',
        curtidas: 53,
        visualizacoes: 260,
        descricao: 'Branding completo, design de aplicativo mobile e peças promocionais de alto engajamento.',
    },
    {
        id: 7,
        titulo: 'Plataforma de Gestão e Monitoramento de Dados',
        categoria: 'Tecnologia',
        tipo: 'Projeto',
        thumb: '/p1.svg',
        curtidas: 71,
        visualizacoes: 310,
        descricao: 'Dashboard interativo com gráficos em tempo real, controle de acesso e relatórios exportáveis.',
    },
    {
        id: 8,
        titulo: 'Apresentação Científica e TCC',
        categoria: 'Pesquisa acadêmica',
        tipo: 'Apresentação',
        thumb: '/p4.svg',
        curtidas: 64,
        visualizacoes: 195,
        descricao: 'Monografia e defesa de trabalho de conclusão com honras acadêmicas e publicação em simpósio.',
    },
];

const portfolios = [...BASE_PORTFOLIOS];

// GET all portfolios
app.get('/api/portfolios', (req, res) => {
    const { categoria, busca } = req.query;
    let result = [...portfolios];

    if (categoria && categoria !== 'Todos') {
        result = result.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (busca) {
        const q = busca.toLowerCase();
        result = result.filter(p => p.titulo.toLowerCase().includes(q) || (p.descricao && p.descricao.toLowerCase().includes(q)));
    }

    res.json(result);
});

// GET portfolio by ID
app.get('/api/portfolios/:id', (req, res) => {
    const portfolio = portfolios.find(p => p.id === Number(req.params.id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    res.json(portfolio);
});

// POST create portfolio
app.post('/api/portfolios', (req, res) => {
    const { titulo, descricao, categoria, tipo, thumb } = req.body;

    if (!titulo) {
        return res.status(400).json({ erro: 'Título é obrigatório.' });
    }

    const novo = {
        id: Date.now(),
        titulo,
        descricao,
        categoria,
        tipo,
        thumb: thumb || '/p1.svg',
        curtidas: 0,
        visualizacoes: 0,
        criadoEm: new Date().toISOString(),
    };

    portfolios.push(novo);
    res.status(201).json({ mensagem: 'Portfólio criado com sucesso.', portfolio: novo });
});

// PUT update portfolio
app.put('/api/portfolios/:id', (req, res) => {
    const portfolio = portfolios.find(p => p.id === Number(req.params.id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    Object.assign(portfolio, req.body);
    res.json({ mensagem: 'Portfólio atualizado.', portfolio });
});

// DELETE portfolio
app.delete('/api/portfolios/:id', (req, res) => {
    const idx = portfolios.findIndex(p => p.id === Number(req.params.id));

    if (idx === -1) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    portfolios.splice(idx, 1);
    res.json({ mensagem: 'Portfólio removido com sucesso.' });
});

// POST curtir portfolio
app.post('/api/portfolios/:id/curtir', (req, res) => {
    const portfolio = portfolios.find(p => p.id === Number(req.params.id));

    if (!portfolio) {
        return res.status(404).json({ erro: 'Portfólio não encontrado.' });
    }

    portfolio.curtidas += 1;
    res.json({ curtidas: portfolio.curtidas });
});

module.exports = app;