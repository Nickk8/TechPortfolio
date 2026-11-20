import { useState } from 'react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { resetPassword } from '../services/api';

/* Webnode-style login illustration SVG */
function LoginIllustration() {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 400 }}>
      {/* Background shapes */}
      <circle cx="200" cy="140" r="120" fill="rgba(255,255,255,0.05)"/>
      {/* Laptop */}
      <rect x="80" y="80" width="240" height="150" rx="12" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
      <rect x="94" y="94" width="212" height="118" rx="6" fill="rgba(0,0,0,0.15)"/>
      {/* Screen UI mockup */}
      <rect x="104" y="102" width="90" height="8" rx="4" fill="rgba(255,255,255,0.7)"/>
      <rect x="104" y="116" width="140" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
      <rect x="104" y="128" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.35)"/>
      {/* Portfolio cards */}
      <rect x="104" y="145" width="58" height="52" rx="8" fill="rgba(255,255,255,0.15)"/>
      <rect x="110" y="152" width="46" height="24" rx="4" fill="rgba(255,255,255,0.1)"/>
      <rect x="110" y="181" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
      <rect x="110" y="189" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      <rect x="171" y="145" width="58" height="52" rx="8" fill="rgba(255,255,255,0.15)"/>
      <rect x="177" y="152" width="46" height="24" rx="4" fill="rgba(255,255,255,0.1)"/>
      <rect x="177" y="181" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
      <rect x="177" y="189" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      <rect x="238" y="145" width="58" height="52" rx="8" fill="rgba(255,255,255,0.15)"/>
      <rect x="244" y="152" width="46" height="24" rx="4" fill="rgba(255,255,255,0.1)"/>
      {/* Laptop stand */}
      <rect x="165" y="230" width="70" height="10" rx="5" fill="rgba(255,255,255,0.15)"/>
      <rect x="145" y="238" width="110" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
      {/* Floating elements */}
      <rect x="20" y="90" width="52" height="26" rx="13" fill="rgba(0,196,255,0.85)"/>
      <text x="30" y="107" fontSize="10" fill="white" fontWeight="700">✓ Grátis</text>
      <rect x="330" y="70" width="58" height="26" rx="13" fill="rgba(255,255,255,0.22)"/>
      <text x="339" y="87" fontSize="9" fill="white" fontWeight="600">Link ↗</text>
      <rect x="330" y="140" width="62" height="26" rx="13" fill="rgba(0,170,255,0.65)"/>
      <text x="338" y="157" fontSize="9" fill="white" fontWeight="600">PDF ↓</text>
      <circle cx="45" cy="160" r="4" fill="rgba(255,255,255,0.4)"/>
      <circle cx="360" cy="110" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="350" cy="200" r="5" fill="rgba(0,196,255,0.4)"/>
    </svg>
  );
}

const LOGIN_FEATURES = [
  { icon: '⚡', text: 'Crie em minutos, sem código' },
  { icon: '🎨', text: 'Modelos profissionais gratuitos' },
  { icon: '🔗', text: 'Link único para compartilhar' },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'cadastro' | 'recuperar'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Password reset fields
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function changeMode(newMode) {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  }

  function openForgotPassword() {
    setResetEmail(loginEmail || '');
    setNewPassword('');
    setConfirmPassword('');
    changeMode('recuperar');
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor, informe seu e-mail e sua senha.');
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
      await register(regName, regEmail, regPassword);
      setLoginEmail(regEmail);
      setLoginPassword('');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setMode('login');
      setSuccessMessage('Cadastro realizado com sucesso! Agora é só entrar.');
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await resetPassword(resetEmail, newPassword);
      setLoginEmail(resetEmail);
      setLoginPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMode('login');
      setSuccessMessage(res.mensagem || 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.');
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* ── Left panel (Webnode-style) ── */}
      <div className="login-left">
        <div className="login-left-overlay" />

        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-logo">MP</div>
            <span className="login-brand-name">Meu Portfólio</span>
          </div>

          <h1 className="login-headline">
            Crie, inspire<br />e conquiste<br />seu espaço.
          </h1>
          <p className="login-sub">
            O gerador de portfólios para quem está começando a carreira.
            Mostre seus talentos, projetos e conquistas em um só lugar.
          </p>

          {/* Webnode-style feature list */}
          <div className="login-features">
            {LOGIN_FEATURES.map(f => (
              <div key={f.text} className="login-feature-item">
                <div className="login-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="login-illustration" style={{ background: 'rgba(255,255,255,0.08)', padding: '20px 16px 8px' }}>
            <LoginIllustration />
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div className="login-right-inner">
          {/* Logo mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13, color: '#fff',
              boxShadow: '0 4px 14px rgba(0,102,255,0.3)',
            }}>MP</div>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#0D1B3E' }}>Meu Portfólio</span>
          </div>

          <h1 className="login-heading">
            {mode === 'login'
              ? 'Bem-vindo de volta!'
              : mode === 'cadastro'
              ? 'Crie sua conta'
              : 'Recuperar Senha'}
          </h1>
          <p className="login-subheading">
            {mode === 'login'
              ? 'Entre com seu e-mail e sua senha.'
              : mode === 'cadastro'
              ? 'Leva menos de um minuto.'
              : 'Informe seu e-mail e crie uma nova senha de acesso.'}
          </p>

          {errorMessage && (
            <div
              id="login-error-msg"
              style={{
                padding: '12px 16px',
                marginBottom: 16,
                backgroundColor: '#FEE8E8',
                color: '#C0392B',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              id="login-success-msg"
              style={{
                padding: '12px 16px',
                marginBottom: 16,
                backgroundColor: '#E8F9F0',
                color: '#0E7A4E',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>✅</span> {successMessage}
            </div>
          )}

          {/* ── FORMULÁRIO DE LOGIN ── */}
          {mode === 'login' && (
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div className="form-input-row">
                    <label className="form-label" htmlFor="login-password">Senha</label>
                    <button
                      type="button"
                      className="forgot-link"
                      id="btn-forgot-password"
                      onClick={openForgotPassword}
                    >
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
                  {loading ? 'Entrando...' : 'Entrar na plataforma →'}
                </button>
                <p style={{ marginTop: 18, fontSize: 14, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    id="btn-ir-cadastro"
                    className="forgot-link"
                    onClick={() => changeMode('cadastro')}
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── FORMULÁRIO DE CADASTRO ── */}
          {mode === 'cadastro' && (
            <form id="register-form" onSubmit={handleRegister}>
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Nome completo</label>
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
                  <label className="form-label" htmlFor="reg-email">E-mail</label>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="maria.silva@exemplo.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-password">Criar senha</label>
                  <input
                    id="reg-password"
                    type="password"
                    className="form-input"
                    placeholder="Mínimo de 6 caracteres"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                  />
                </div>
                <button id="btn-register" type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Criar minha conta grátis →'}
                </button>
                <p style={{ marginTop: 18, fontSize: 14, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Já tem conta?{' '}
                  <button
                    type="button"
                    id="btn-ir-login"
                    className="forgot-link"
                    onClick={() => changeMode('login')}
                  >
                    Entrar
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── FORMULÁRIO DE RECUPERAÇÃO / ESQUECI A SENHA ── */}
          {mode === 'recuperar' && (
            <form id="forgot-password-form" onSubmit={handleResetPassword}>
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">E-mail cadastrado</label>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    placeholder="seu.email@exemplo.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-password">Nova senha</label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-input"
                    placeholder="Mínimo de 6 caracteres"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-password">Confirmar nova senha</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="form-input"
                    placeholder="Digite novamente a nova senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button id="btn-reset-password" type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Redefinindo...' : 'Redefinir minha senha →'}
                </button>
                <p style={{ marginTop: 18, fontSize: 14, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Lembrou a senha?{' '}
                  <button
                    type="button"
                    id="btn-voltar-login"
                    className="forgot-link"
                    onClick={() => changeMode('login')}
                  >
                    Voltar para o login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Trust badges (Webnode-style) */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['🔒 Seguro', '⚡ Grátis', '📱 Mobile'].map(b => (
              <span key={b} style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
