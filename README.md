# 🎓 Meu Portfólio (TechPortfolio)

Plataforma web moderna feita sob medida para **estudantes do Ensino Médio e Técnico** criarem, gerenciarem e exibirem seus projetos, estudos e conquistas acadêmicas de forma profissional.

---

## ✨ Funcionalidades

- **Autenticação de Estudantes**: Login e Cadastro com formulário e botões sociais (Google / Microsoft).
- **Dashboard / Início**: Banner de boas-vindas, estatísticas gerais (portfólios publicados, curtidas e visualizações) e projetos em alta.
- **Meu Perfil**: Foto/avatar de perfil, informações da instituição, curso, série, cidade, biografia e galeria de portfólios.
- **Catálogo de Portfólios**: Listagem completa com filtros rápidos por categoria (*Tecnologia*, *Pesquisa acadêmica*, *Design*) e busca em tempo real.
- **Criação de Projetos**: Formulário intuitivo com upload de capa, seleção de modalidades, links externos e descrição.
- **Interatividade & Curtidas**: Sistema de curtidas conectado diretamente à API do backend.
- **Rodapé Completo**: Links institucionais, dados de contato e atalhos para redes sociais com botão de encerramento de sessão (*Sair*).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**
- **Vite 8**
- **React Router DOM 7**
- **Vanilla CSS** (Design System próprio com variáveis e animações)

### Backend
- **Node.js**
- **Express 5**
- **CORS** & middlewares de autenticação simulada

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` instalado

---

### 2. Iniciar o Backend
Abra um terminal e execute:

```bash
cd backend
npm install
npm start
```
> O servidor estará rodando em: `http://localhost:3000`

---

### 3. Iniciar o Frontend
Em outro terminal, execute:

```bash
cd frontend
npm install
npm run dev
```
> Acesse a aplicação no navegador em: `http://localhost:5173`

---

## 📂 Estrutura do Projeto

```text
TechPortfolio-main/
├── backend/                  # Servidor Express e rotas de API
│   ├── src/
│   │   ├── app.js            # Definição dos endpoints REST
│   │   └── server.js         # Inicialização do servidor na porta 3000
│   └── package.json
│
├── frontend/                 # Aplicação React + Vite
│   ├── public/               # Imagens e assets estáticos
│   ├── src/
│   │   ├── components/       # Sidebar, Topbar, Footer, PortfolioCard
│   │   ├── pages/            # Login, Início, Perfil, Portfólios, Criar
│   │   ├── services/         # Integração com a API Backend
│   │   ├── App.jsx           # Rotas e layout base
│   │   └── App.css           # Estilos globais da aplicação
│   ├── index.html
│   └── vite.config.js
│
├── DOCUMENTACAO.txt          # Documentação detalhada em formato texto
└── README.md                 # Apresentação do repositório
```

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de demonstração.
