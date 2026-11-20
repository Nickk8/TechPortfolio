import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';

function Footer() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--primary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,102,255,0.4)',
          }}>
            <svg width="18" height="18" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20L10 7l5 10 4-7 2 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Meu Portfólio</div>
            <div style={{ fontSize: 11.5, color: '#8BA3C7' }}>Seu espaço criativo</div>
          </div>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Plataforma</h4>
          <p className="footer-col-desc">Criar portfólio</p>
          <p className="footer-col-desc">Explorar</p>
          <p className="footer-col-desc">Ajuda</p>
        </div>

        {/* Contato */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contato</h4>
          <p className="footer-col-desc">[SEU E-MAIL]</p>
          <p className="footer-col-desc">[SEU TELEFONE]</p>
        </div>

        {/* Redes sociais */}
        <div className="footer-col footer-socials-col">
          <h4 className="footer-col-title">Redes sociais</h4>
          <div className="footer-social-chips">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-chip">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-chip">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-chip">GitHub</a>
          </div>
        </div>

        {/* Logout */}
        <div className="footer-logout-col">
          <button
            type="button"
            id="footer-btn-sair"
            className="footer-sair-btn"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
      </div>

      {/* Webnode-style gradient bottom bar */}
      <div className="footer-bottom-bar" />
    </footer>
  );
}

export default Footer;
