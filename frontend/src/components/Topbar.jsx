function Topbar({ searchValue, onSearchChange }) {
  return (
    <header className="topbar">
      <div className="search-bar">
        <span className="search-icon">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          id="search-input"
          type="text"
          placeholder="Buscar portfólios, estudantes, temas..."
          value={searchValue || ''}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button id="topbar-notif-btn" className="topbar-btn notif-dot" title="Notificações">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2z" fill="currentColor" opacity="0.4"/>
            <path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        </button>

        <div id="topbar-user-badge" className="user-badge">
          <div className="user-avatar-sm">MS</div>
          <div className="user-info">
            <span className="user-name">Maria Silva</span>
            <span className="user-role">Estudante</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
