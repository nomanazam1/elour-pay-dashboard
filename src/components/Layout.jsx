import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Layout.css';

const NAV = [
  { to: '/',            label: 'Dashboard',    icon: '⬡' },
  { to: '/transactions',label: 'Transactions', icon: '↕' },
  { to: '/orders',      label: 'Orders',       icon: '◫' },
  { to: '/analytics',   label: 'Analytics',    icon: '◈' },
  { to: '/refunds',     label: 'Refunds',      icon: '↺' },
  { to: '/settings',    label: 'Settings',     icon: '⚙' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-name">ÉLOUR</span>
          <span className="brand-sub">PAY</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="user-details">
              <div className="user-email">{user?.email}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignOut} title="Sign out">
            ⎋
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
