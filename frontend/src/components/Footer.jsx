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
        {/* Sair */}
        <div className="footer-logout-col">
          <button
            type="button"
            id="footer-btn-sair"
            className="footer-sair-btn"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>

        {/* Meu Portfólio */}
        <div className="footer-col">
          <h4 className="footer-col-title">Meu Portfólio</h4>
          <p className="footer-col-desc">Seu espaço criativo de conquistas.</p>
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
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
            >
              TikTok
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
            >
              YouTube
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-chip"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar" />
    </footer>
  );
}

export default Footer;
