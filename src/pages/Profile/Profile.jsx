import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Profile.css';

const API_BASE = 'https://monsoon-jqgy.onrender.com/api/auth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('Loading profile...');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/');
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchProfile(parsed.username);
  }, [navigate]);

  const fetchProfile = async (username) => {
    try {
      const response = await fetch(`${API_BASE}/profile/${username}`);
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const errorMessage = contentType.includes('application/json')
          ? (await response.json()).message
          : await response.text();
        setStatus(`Unable to load profile: ${errorMessage}`);
        return;
      }

      if (!contentType.includes('application/json')) {
        const errorText = await response.text();
        setStatus(`Unable to load profile: ${errorText}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setStatus('Profile loaded');
      } else {
        setStatus(data.message || 'Unable to load profile');
      }
    } catch (error) {
      setStatus(`Error loading profile: ${error.message}`);
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="profile-shell">
      <Navbar user={user} />
      <div className="profile-body">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile?.name ? profile.name[0].toUpperCase() : (user?.name ? user.name[0].toUpperCase() : 'U')}
            </div>
            <div className="profile-heading">
              <h1>{profile?.name || user?.name || 'User Profile'}</h1>
              <p>{profile ? `@${profile.username}` : user ? `@${user.username}` : 'Loading...'}</p>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-row">
              <span>Name</span>
              <strong>{profile?.name || user?.name || 'Unknown'}</strong>
            </div>
            <div className="profile-row">
              <span>Username</span>
              <strong>{profile?.username || user?.username || 'Unknown'}</strong>
            </div>
            <div className="profile-row">
              <span>Email</span>
              <strong>{profile?.email || 'Not provided'}</strong>
            </div>
            <div className="profile-row">
              <span>Status</span>
              <strong>{status}</strong>
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-button" onClick={() => navigate('/home')}>
              Back to chat
            </button>
            <button type="button" className="profile-button logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
