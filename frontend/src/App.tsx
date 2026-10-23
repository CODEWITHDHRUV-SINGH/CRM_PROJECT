import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import './styles.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('crm-demo-auth') === 'true',
  );

  function handleLogin(rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('crm-demo-auth', 'true');
    } else {
      localStorage.removeItem('crm-demo-auth');
    }
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem('crm-demo-auth');
    setIsAuthenticated(false);
  }

  return isAuthenticated
    ? <DashboardPage onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}