import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Icon from '../Icon/Icon';
import Camera from '../Camera/Camera';
import {
  FiArrowLeft,
  FiCamera,
  FiMoreVertical,
} from 'react-icons/fi';

export default function Navbar({ user, showBackButton = false, onBack }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (action) => {
    console.log(`Action: ${action}`);
    setShowMenu(false);
    // TODO: Implement actual functionality
  };

  const goToProfile = () => {
    setShowMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowMenu(false);
    navigate('/');
  };

  return (
    <>
      <header className="navbar-shell">
      <div className="navbar-brand">
        {showBackButton && (
          <button className="navbar-back-button" type="button" onClick={onBack} aria-label="Back to chats">
            <Icon component={FiArrowLeft} size={24} title="Back to chats" />
          </button>
        )}
        <div className="navbar-logo"><img src="/favicon.png" alt="favicon.png" /></div>
        <div>
          <span className="navbar-title">Monsoon</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" aria-label="Open camera" type="button" onClick={() => setShowCamera(true)}>
          <Icon component={FiCamera} size={24} title="Open camera" />
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
              <div className="dropdown-profile">
                <div className="dropdown-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="dropdown-profile-text">
                  <span>{user?.name || 'Unknown User'}</span>
                  <small>@{user?.username || 'unknown'}</small>
                </div>
              </div>

              <button className="dropdown-item" onClick={goToProfile} type="button">
                View Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                Logout
              </button>
              <div className="dropdown-separator" />
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

      <Camera showCamera={showCamera} onClose={() => setShowCamera(false)} />
    </>
  );
}
