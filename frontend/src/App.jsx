import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from './router';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import UsuarioPage from './pages/UsuarioPage';
import InicioPage from './pages/InicioPage';
import CriarPage from './pages/CriarPage';
import PortfoliosPage from './pages/PortfoliosPage';
import PortfolioDetalhePage from './pages/PortfolioDetalhePage';

// Layout wrapper that includes sidebar + topbar + footer
function AppLayout({ children, searchValue, onSearchChange }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar searchValue={searchValue} onSearchChange={onSearchChange} />
        {children}
        <Footer />
      </div>
    </div>
  );
}

// Só deixa passar quem está logado. Quem não está vai para o login.
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Tela de login: se a pessoa já está logada, vai direto para dentro.
function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/usuario" replace />;
  return children;
}

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Login page — no layout wrapper */}
          <Route path="/" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />

          {/* Rota pública para visualização via link oficial e download de PDF */}
          <Route path="/portfolio/:id" element={<PortfolioDetalhePage />} />
          <Route path="/p/:id" element={<PortfolioDetalhePage />} />

          {/* App pages — with layout, só para quem está logado */}
          <Route
            path="/usuario"
            element={
              <RequireAuth>
                <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
                  <UsuarioPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/inicio"
            element={
              <RequireAuth>
                <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
                  <InicioPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/criar"
            element={
              <RequireAuth>
                <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
                  <CriarPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/portfolios"
            element={
              <RequireAuth>
                <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
                  <PortfoliosPage searchValue={searchValue} />
                </AppLayout>
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
