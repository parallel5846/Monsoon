import { useState } from 'react';
import './Navbar.css';
import Icon from '../Icon/Icon';
import { FiCamera, FiMoreVertical } from 'react-icons/fi';

export default function Navbar({ user }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (action) => {
    console.log(`Action: ${action}`);
    setShowMenu(false);
    // TODO: Implement actual functionality
  };

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
        <div className="menu-container">
          <button
            className="navbar-icon"
            aria-label="Open menu"
            type="button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon component={FiMoreVertical} size={24} title="Open menu" />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('settings')}
                type="button"
              >
                Settings
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('create-group')}
                type="button"
              >
                Create Group
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('new-community')}
                type="button"
              >
                New Community
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
