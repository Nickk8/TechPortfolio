import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import UsuarioPage from './pages/UsuarioPage';
import InicioPage from './pages/InicioPage';
import CriarPage from './pages/CriarPage';
import PortfoliosPage from './pages/PortfoliosPage';

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

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page — no layout wrapper */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* App pages — with layout */}
        <Route
          path="/usuario"
          element={
            <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
              <UsuarioPage />
            </AppLayout>
          }
        />
        <Route
          path="/inicio"
          element={
            <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
              <InicioPage />
            </AppLayout>
          }
        />
        <Route
          path="/criar"
          element={
            <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
              <CriarPage />
            </AppLayout>
          }
        />
        <Route
          path="/portfolios"
          element={
            <AppLayout searchValue={searchValue} onSearchChange={setSearchValue}>
              <PortfoliosPage searchValue={searchValue} />
            </AppLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
