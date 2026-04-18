import './Navbar.css';

export default function Navbar({ user }) {
  return (
    <header className="navbar-shell">
      <div className="navbar-brand">
        <div className="navbar-logo">M</div>
        <div>
          <span className="navbar-title">Monsoon</span>
          <span className="navbar-subtitle">Secure chat dashboard</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" aria-label="Scan QR">📷</button>
        <button className="navbar-icon" aria-label="Open menu">⋮</button>
      </div>
    </header>
  );
}
