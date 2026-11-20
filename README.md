# 🎓 Meu Portfólio (TechPortfolio)

Plataforma web profissional inspirada no design e metodologia do **Webnode**, projetada sob medida para **estudantes do Ensino Médio e Técnico** criarem, gerenciarem, compartilharem via link oficial e exportarem em PDF seus projetos acadêmicos e tecnológicos.

---

## 🎨 Identidade Visual e Recursos (Padrão Webnode)

- **Paleta de Cores Oficial Webnode**:
  - Azul Primário: `#0066FF`
  - Gradiente Webnode: `linear-gradient(135deg, #0057E0 0%, #00C4FF 100%)`
  - Ciano Destaque: `#00C4FF`
  - Azul Noturno / Sidebar: `#0A1628`
  - Fundo Suave: `#F0F4FF`
- **Ilustrações Vetoriais SVG**: Substituição completa dos placeholders antigos por gráficos vetoriais de alta definição (`/p1.svg`, `/p2.svg`, `/p3.svg`, `/p4.svg`, `/banner.svg`, `/students.svg`).
- **Captação de Informações**: Barra de captação de título rápido na página inicial e assistente guiado em 4 etapas.
- **Salvar & Compartilhar**:
  - 🔗 **Link Oficial Único**: Página pública acessível em `/portfolio/:id` ou `/p/:id` para anexar em currículos e redes sociais.
  - 📄 **Salvar em PDF**: Exportação profissional formatada para folha A4 com `@media print` que remove barras e botões durante a impressão.
  - 📲 **Compartilhamento Social**: Botões diretos para WhatsApp e LinkedIn.
- **Recuperação de Senha**: Fluxo completo de "Esqueceu a senha?" na página de login com tolerância a falhas.
- **Catálogo Completo**: A aba "Todos" exibe todos os portfólios ativos (seus projetos publicados + modelos da comunidade).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**
- **Vite 8**
- **Vanilla CSS** (Design System com paleta Webnode e responsividade mobile-first)
- **Roteador SPA Próprio** (Suporte a rotas dinâmicas `/portfolio/:id`)

### Backend
- **Node.js**
- **Express 5**
- **PostgreSQL** com suporte resiliente a fallback local (`users.json`)
- **Bcrypt & JWT** (Autenticação e redefinição de senhas)
- **CORS & Dotenv**

---

## 🚀 Como Rodar o Sistema Passo a Passo

Para executar o sistema completo, você precisará de **dois terminais** abertos simultaneamente (um para a API Backend e outro para a Aplicação Frontend).

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalado.
- Navegador moderno (Google Chrome, Microsoft Edge, Brave, etc.).

---

### Passo 1: Iniciar o Servidor Backend (API)

1. Abra um terminal (PowerShell ou Prompt de Comando) na raiz do projeto:
   ```bash
   cd backend
   ```

2. Instale as dependências (necessário apenas na primeira vez):
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```
   > 💡 *Dica:* Para rodar com reinicialização automática ao editar arquivos, use: `npm run dev`

4. Mensagem esperada no console:
   ```text
   Servidor rodando, gracas a Deus, em http://localhost:3000
   ```

---

### Passo 2: Iniciar a Aplicação Frontend

1. Abra um **segundo terminal** (mantenha o terminal do backend rodando em segundo plano):
   ```bash
   cd frontend
   ```

2. Instale as dependências (necessário apenas na primeira vez):
   ```bash
   npm install
   ```

3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```

4. Mensagem esperada no console:
   ```text
   VITE v8.3.0 ready in ... ms
   ➜  Local:   http://localhost:5173/
   ```

---

### Passo 3: Acessar a Plataforma

Abra o seu navegador e acesse:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 🔐 Credenciais de Acesso Disponíveis

Você pode utilizar qualquer uma das contas cadastradas na base de dados:

| E-mail | Senha Padrão | Nome do Estudante |
| :--- | :--- | :--- |
| `kauanmelomaia@gmail.com` | `Rr93350912` | Kauan Maia (IFCE) |
| `maria.silva@escola.br` | `123` | Maria Silva |
| `jenniferanne418@gmail.com` | `123456789` | Jennifer Anne |

> 🔑 **Esqueceu ou quer trocar a senha?**
> Na tela de login, clique em **"Esqueceu a senha?"**, informe o e-mail cadastrado e defina uma nova senha de no mínimo 6 caracteres. O acesso com a nova senha é liberado imediatamente.

---

## 📱 Páginas e Navegação do Sistema

| Rota | Descrição |
| :--- | :--- |
| `/login` ou `/` | Página de acesso com login, cadastro e recuperação de senha. |
| `/inicio` | Tela inicial estilo Webnode: barra rápida de captura, galeria de templates e guia de 4 passos. |
| `/criar` | Assistente interativo em 4 etapas para construir portfólios com visualização em tempo real. |
| `/portfolios` | Catálogo completo com filtros por categoria (**Todos**, **Tecnologia**, **Pesquisa acadêmica**, **Design**). |
| `/usuario` | Perfil do estudante autenticado com seus dados, instituição e seus projetos publicados. |
| `/portfolio/:id` | Visualização pública do portfólio via link oficial com botões de **Salvar em PDF** e compartilhamento. |

---

## 📂 Estrutura de Diretórios

```text
TechPortfolio-main/
├── backend/                       # Servidor Node.js / Express
│   ├── src/
│   │   ├── app.js                 # Endpoints REST e catálogo de portfólios
│   │   ├── server.js              # Inicialização do servidor na porta 3000
│   │   ├── auth.js                # Login, cadastro, redefinição de senha e JWT
│   │   ├── db.js                  # Conexão PostgreSQL com timeout resiliente
│   │   └── data/
│   │       └── users.json         # Base de usuários em JSON (fallback offline)
│   ├── .env                       # Variáveis de ambiente (JWT_SECRET, DB)
│   └── package.json
│
├── frontend/                      # Aplicação React 19 + Vite
│   ├── public/                    # Gráficos e capas vetoriais SVG
│   │   ├── p1.svg, p2.svg, p3.svg, p4.svg
│   │   ├── banner.svg, students.svg, favicon.svg
│   ├── src/
│   │   ├── components/            # Sidebar, Topbar, Footer, PortfolioCard
│   │   ├── context/               # AuthContext (sessão de usuário)
│   │   ├── pages/                 # Login, Início, Criar, Portfólios, Perfil, Detalhe
│   │   │   ├── LoginPage.jsx
│   │   │   ├── InicioPage.jsx
│   │   │   ├── CriarPage.jsx
│   │   │   ├── PortfoliosPage.jsx
│   │   │   ├── UsuarioPage.jsx
│   │   │   └── PortfolioDetalhePage.jsx
│   │   ├── services/              # Integração com API e persistência local
│   │   ├── router.jsx             # Roteador SPA com suporte a rotas dinâmicas
│   │   ├── App.jsx                # Layout mestre e proteção de rotas
│   │   ├── App.css                # Estilos da interface
│   │   └── index.css              # Variáveis de tema Webnode e resets
│   ├── index.html
│   └── vite.config.js
│
├── DOCUMENTACAO.txt               # Guia técnico e documentação em texto puro
└── README.md                      # Apresentação e guia do repositório
```

---

## 📄 Licença

Projeto desenvolvido para fins educacionais e profissionais. Todos os direitos reservados.
