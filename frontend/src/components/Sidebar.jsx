import { NavLink } from '../router';

/* Webnode-style logo mark */
function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="26" height="26" rx="6" fill="none"/>
      <path d="M5 20L10 7l5 10 4-7 2 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LogoMark />
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/usuario"
          id="nav-usuario"
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          <span className="sidebar-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="sidebar-label">Perfil</span>
        </NavLink>

        <NavLink
          to="/inicio"
          id="nav-inicio"
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          <span className="sidebar-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M3 12L12 4l9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="sidebar-label">Início</span>
        </NavLink>

        <NavLink
          to="/criar"
          id="nav-criar"
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          <span className="sidebar-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="sidebar-label">Criar</span>
        </NavLink>

        <NavLink
          to="/portfolios"
          id="nav-portfolios"
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          <span className="sidebar-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </span>
          <span className="sidebar-label">Portfólios</span>
        </NavLink>
      </nav>

      {/* Bottom help icon */}
      <div style={{ marginTop: 'auto', paddingBottom: 8 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--sidebar-text)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="0.8" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
