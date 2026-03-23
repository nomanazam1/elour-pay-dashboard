import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Login.css';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { signIn } = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);

    const { error: err } = await signIn(email, password);

    if (err) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    navigate('/');
  }

  return (
    <div className="login-page">
      <div className="login-card fade-up">
        <div className="login-brand">
          <div className="login-brand-name">ÉLOUR</div>
          <div className="login-brand-sub">PAY DASHBOARD</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          ELOURA PERSONAL CARE PVT LTD — Internal Use Only
        </div>
      </div>
    </div>
  );
}
