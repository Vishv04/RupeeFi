import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { useState } from 'react';
import './App.css';
import { Navbar } from './components/common/Navbar/Navbar';
import Herosection from './components/Home/HeroSection';

import MerchantDashboard from './components/Merchant/MerchantDashboard'
import MerchantLogin from './components/merchant/MerchantLogin';
import MerchantRegister from './components/merchant/MerchantRegister';
import MerchantLanding from './components/merchant/MerchantLanding';

// NavbarWrapper component to conditionally render navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't render navbar on merchant page
  return location.pathname !== '/merchant' ? <Navbar /> : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <NavbarWrapper isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/merchant" 
          element={<MerchantDashboard/>} 
        />
        <Route 
          path="/home" 
          element={<Herosection />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/" 
          element={<Navigate to="/home" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route path="/merchant" element={<MerchantLanding />} />
        <Route path="/merchant/login" element={<MerchantLogin />} />
        <Route path="/merchant/register" element={<MerchantRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
