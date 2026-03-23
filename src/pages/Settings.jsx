import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './Settings.css';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Account and application settings</div>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="settings-section-title">Account</div>
          <div className="settings-row">
            <div className="settings-label">Email</div>
            <div className="settings-value">{user?.email}</div>
          </div>
          <div className="settings-row">
            <div className="settings-label">Role</div>
            <div className="settings-value">Administrator</div>
          </div>
          <div className="settings-row">
            <div className="settings-label">Company</div>
            <div className="settings-value">ELOURA PERSONAL CARE PVT LTD</div>
          </div>
          <div className="settings-row">
            <div className="settings-label">Last Sign In</div>
            <div className="settings-value">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString('en-PK')
                : '—'}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="settings-section-title">API</div>
          <div className="settings-row">
            <div className="settings-label">Supabase Project</div>
            <div className="settings-value mono">rxifkkcjjgurgrutnwkm</div>
          </div>
          <div className="settings-row">
            <div className="settings-label">API Status</div>
            <div className="settings-value">
              <span className="badge badge-success">Live</span>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-label">Safepay Mode</div>
            <div className="settings-value">
              <span className="badge badge-warning">Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-danger-zone">
        <div className="danger-title">Session</div>
        <div className="danger-desc">Sign out of the Élour Pay dashboard on this device.</div>
        <button className="danger-btn" onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}
