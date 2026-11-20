const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'techportfolio_super_secret_jwt_key_2026';
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

function formatUsername(name) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function toUser(row) {
    return {
        id: row.id,
        nome: row.nome,
        username: row.username || row.login,
        email: row.email,
        instituicao: row.instituicao || '',
        curso: row.curso || '',
        anoSerie: row.anoSerie || row.ano_serie || '',
        cidade: row.cidade || '',
        bio: row.bio || '',
        papel: row.papel || 'Estudante',
    };
}

function loadUsersJson() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Erro ao ler users.json:', err);
        return [];
    }
}

function saveUsersJson(users) {
    try {
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error('Erro ao salvar users.json:', err);
    }
}

// ── CADASTRO ────────────────────────────────────────────────────────
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha, instituicao, curso, anoSerie } = req.body;

        if (!nome?.trim() || !email?.trim() || !senha) {
            return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
        }
        if (String(senha).length < 6) {
            return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
        }

        const emailLower = email.trim().toLowerCase();

        // 1. Tentar salvar no PostgreSQL se disponível
        try {
            const existe = await pool.query('SELECT 1 FROM public.aluno WHERE email = $1', [emailLower]);
            if (existe.rowCount > 0) {
                return res.status(400).json({ erro: 'Já existe um cadastro com este e-mail.' });
            }

            const base = formatUsername(nome) || 'usuario';
            let login = base;
            let n = 1;
            while ((await pool.query('SELECT 1 FROM public.aluno WHERE login = $1', [login])).rowCount > 0) {
                login = `${base}${n++}`;
            }

            const hash = await bcrypt.hash(String(senha), 10);
            const result = await pool.query(
                'INSERT INTO public.aluno (nome, login, senha_hash, email) VALUES ($1, $2, $3, $4) RETURNING id, nome, login, email',
                [nome.trim(), login, hash, emailLower]
            );

            return res.status(201).json({
                mensagem: 'Cadastro realizado com sucesso. Faça login para entrar.',
                usuario: toUser(result.rows[0]),
            });
        } catch (dbErr) {
            console.warn('Banco PostgreSQL inacessível, utilizando armazenamento users.json:', dbErr.message);
        }

        // 2. Fallback: users.json
        const users = loadUsersJson();
        if (users.some(u => u.email.toLowerCase() === emailLower)) {
            return res.status(400).json({ erro: 'Já existe um cadastro com este e-mail.' });
        }

        const base = formatUsername(nome) || 'usuario';
        let login = base;
        let n = 1;
        while (users.some(u => u.username === login)) {
            login = `${base}${n++}`;
        }

        const newUser = {
            id: Date.now(),
            nome: nome.trim(),
            username: login,
            email: emailLower,
            senha: String(senha),
            instituicao: instituicao || 'Ensino Médio',
            curso: curso || '',
            anoSerie: anoSerie || '1º Ano',
            cidade: 'Brasil',
            bio: `Estudante na instituição ${instituicao || 'de ensino'}.`,
            papel: 'Estudante',
            criadoEm: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsersJson(users);

        res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso. Faça login para entrar.',
            usuario: toUser(newUser),
        });
    } catch (err) {
        console.error('Erro no cadastro:', err);
        res.status(500).json({ erro: 'Erro interno ao cadastrar.' });
    }
});

// ── LOGIN ───────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email?.trim() || !senha) {
            return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
        }

        const emailLower = email.trim().toLowerCase();

        // 1. Tentar validar no PostgreSQL se o banco estiver online
        try {
            const result = await pool.query(
                'SELECT * FROM public.aluno WHERE email = $1',
                [emailLower]
            );
            const user = result.rows[0];
            if (user) {
                const senhaCorreta = await bcrypt.compare(String(senha), user.senha_hash);
                if (senhaCorreta) {
                    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
                    return res.json({
                        mensagem: 'Login realizado com sucesso.',
                        usuario: toUser(user),
                        token,
                    });
                }
            }
        } catch (dbErr) {
            console.warn('Banco PostgreSQL inacessível no login, verificando users.json:', dbErr.message);
        }

        // 2. Fallback: users.json
        const users = loadUsersJson();
        const localUser = users.find(u => u.email && u.email.toLowerCase() === emailLower);

        if (localUser) {
            // Suporta senha plana ou hash bcrypt
            let senhaValida = localUser.senha === String(senha);
            if (!senhaValida && localUser.senha_hash) {
                senhaValida = await bcrypt.compare(String(senha), localUser.senha_hash).catch(() => false);
            }

            if (senhaValida) {
                const token = jwt.sign({ id: localUser.id }, JWT_SECRET, { expiresIn: '7d' });
                return res.json({
                    mensagem: 'Login realizado com sucesso.',
                    usuario: toUser(localUser),
                    token,
                });
            }
        }

        // Se chegou aqui, e-mail ou senha estão errados
        return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: 'Erro interno ao fazer login.' });
    }
});

// ── REDEFINIR / RECUPERAR SENHA ────────────────────────────────────
router.post('/redefinir-senha', async (req, res) => {
    try {
        const { email, novaSenha } = req.body;

        if (!email?.trim() || !novaSenha) {
            return res.status(400).json({ erro: 'E-mail e nova senha são obrigatórios.' });
        }

        if (String(novaSenha).length < 6) {
            return res.status(400).json({ erro: 'A nova senha precisa ter pelo menos 6 caracteres.' });
        }

        const emailLower = email.trim().toLowerCase();

        // 1. Tentar atualizar no PostgreSQL se disponível
        try {
            const hash = await bcrypt.hash(String(novaSenha), 10);
            const result = await pool.query(
                'UPDATE public.aluno SET senha_hash = $1 WHERE email = $2 RETURNING id, nome, email',
                [hash, emailLower]
            );
            if (result.rowCount > 0) {
                return res.json({
                    mensagem: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.',
                });
            }
        } catch (dbErr) {
            console.warn('Banco PostgreSQL inacessível na redefinição de senha:', dbErr.message);
        }

        // 2. Fallback: users.json
        const users = loadUsersJson();
        const userIndex = users.findIndex(u => u.email && u.email.toLowerCase() === emailLower);

        if (userIndex === -1) {
            return res.status(404).json({ erro: 'Nenhum cadastro encontrado com este e-mail.' });
        }

        users[userIndex].senha = String(novaSenha);
        if (users[userIndex].senha_hash) {
            users[userIndex].senha_hash = await bcrypt.hash(String(novaSenha), 10);
        }
        saveUsersJson(users);

        return res.json({
            mensagem: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.',
        });
    } catch (err) {
        console.error('Erro ao redefinir senha:', err);
        res.status(500).json({ erro: 'Erro interno ao redefinir senha.' });
    }
});

// ── QUEM SOU EU (/me) ───────────────────────────────────────────────
router.get('/me', async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
        if (!token) {
            return res.status(401).json({ erro: 'Não autenticado.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // 1. Tentar buscar no banco
        try {
            const result = await pool.query('SELECT * FROM public.aluno WHERE id = $1', [decoded.id]);
            if (result.rowCount > 0) {
                return res.json(toUser(result.rows[0]));
            }
        } catch (dbErr) {
            // fallback
        }

        // 2. Buscar no users.json
        const users = loadUsersJson();
        const user = users.find(u => String(u.id) === String(decoded.id));
        if (user) {
            return res.json(toUser(user));
        }

        res.status(404).json({ erro: 'Usuário não encontrado.' });
    } catch {
        res.status(401).json({ erro: 'Não autenticado.' });
    }
});

module.exports = router;
