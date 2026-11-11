import { useState } from 'react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor, informe seu e-mail ou nome e sua senha.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await login(loginEmail, loginPassword);
      navigate('/usuario');
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Nome, e-mail e senha são obrigatórios para cadastro.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await register(regName, regEmail, regPassword, regSchool);
      setSuccessMessage('Cadastro realizado com sucesso! Entrando na plataforma...');
      setTimeout(() => {
        navigate('/usuario');
      }, 400);
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <img
          className="login-left-bg"
          src="/students.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="login-left-overlay" />

        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-logo">MP</div>
            <span className="login-brand-name">Meu Portfólio</span>
          </div>

          <h1 className="login-headline">
            Crie, inspire e conquiste seu espaço.
          </h1>
          <p className="login-sub">
            O gerador de portfólios feito especialmente para estudantes do ensino médio.
            Mostre seus talentos, projetos de aula e conquiste vagas de estágio ou universidade!
          </p>

          <div className="login-illustration">
            <img src="/students.jpg" alt="Estudantes colaborando" />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-right-inner">
          <h1 className="login-heading">Comece agora!</h1>
          <p className="login-subheading">
            Acesse sua conta ou crie uma nova em poucos segundos.
          </p>

          <div className="social-auth">
            <button id="btn-google" className="social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button id="btn-microsoft" className="social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
              </svg>
              Microsoft
            </button>
          </div>

          <div className="divider">ou use seu e-mail ou nome</div>

          {errorMessage && (
            <div
              id="login-error-msg"
              style={{
                padding: '12px 16px',
                marginBottom: 16,
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid #f87171',
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              id="login-success-msg"
              style={{
                padding: '12px 16px',
                marginBottom: 16,
                backgroundColor: '#d1fae5',
                color: '#065f46',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid #34d399',
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Login section */}
          <form id="login-form" onSubmit={handleLogin}>
            <div className="form-section">
              <div className="form-section-title">Acessar Minha Conta</div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">E-mail ou Nome Completo</label>
                <input
                  id="login-email"
                  type="text"
                  className="form-input"
                  placeholder="seu.email@escola.com ou seu nome"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="form-input-row">
                  <label className="form-label" htmlFor="login-password">Senha</label>
                  <button type="button" className="forgot-link" id="btn-forgot-password">
                    Esqueceu a senha?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
              <button id="btn-login" type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Acessando...' : 'Entrar na Plataforma'}
              </button>
            </div>
          </form>

          {/* Register section */}
          <form id="register-form" onSubmit={handleRegister}>
            <div className="form-section">
              <div className="form-section-title" style={{ '--dot-color': '#10b981' }}>
                Primeiro acesso? Cadastre-se
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Nome Completo</label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="Maria Silva"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">E-mail Escolar</label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="maria.silva@escola.br"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-school">Instituição de Ensino</label>
                <input
                  id="reg-school"
                  type="text"
                  className="form-input"
                  placeholder="Colégio Estadual"
                  value={regSchool}
                  onChange={e => setRegSchool(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Criar Senha</label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                />
              </div>
              <button id="btn-register" type="submit" className="btn-secondary" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Criar minha conta gratuita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
