import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Layout   from './components/Layout.jsx';
import Login    from './pages/Login.jsx';
import Home     from './pages/Home.jsx';
import Transactions from './pages/Transactions.jsx';
import Orders   from './pages/Orders.jsx';
import Analytics from './pages/Analytics.jsx';
import Refunds  from './pages/Refunds.jsx';
import Settings from './pages/Settings.jsx';
import ElourDashboard from './pages/Elourpaydashboard';


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <ElourDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index        element={<Home />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="orders"       element={<Orders />} />
            <Route path="analytics"    element={<Analytics />} />
            <Route path="refunds"      element={<Refunds />} />
            <Route path="settings"     element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
