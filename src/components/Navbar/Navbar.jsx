import './Navbar.css';
import Icon from '../Icon/Icon';
import { FiCamera, FiMoreVertical } from 'react-icons/fi';

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
        <button className="navbar-icon" aria-label="Scan QR" type="button">
          <Icon component={FiCamera} size={24} title="Scan QR" />
        </button>
        <button className="navbar-icon" aria-label="Open menu" type="button">
          <Icon component={FiMoreVertical} size={24} title="Open menu" />
        </button>
      </div>
    </header>
  );
}
