import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserRole('');
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;
  return <Dashboard userRole={userRole} onLogout={handleLogout} />;
}

export default App;
