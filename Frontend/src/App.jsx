import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { useState } from 'react';
import './App.css';
import { Navbar } from './components/common/Navbar/Navbar';
import Herosection from './components/Home/HeroSection';
import Profile from './components/profile/Profile';

import MerchantDashboard from './components/Merchant/MerchantDashboard'
import MerchantLogin from './components/Merchant/MerchantLogin';
import MerchantRegister from './components/Merchant/MerchantRegister';
import MerchantLanding from './components/Merchant/MerchantLanding';
import WalletDashboard from './components/wallet/WalletDashboard';
import UPIWallet from './components/wallet/UPIWallet';
import ERupeeWallet from './components/wallet/ERupeeWallet';


// NavbarWrapper component to conditionally render navbar
const NavbarWrapper = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  // Don't render navbar on merchant page
  return location.pathname !== '/merchant' ? (
    <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
  ) : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wallet/upi/:userId" 
          element={isAuthenticated ? <UPIWallet /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wallet/erupee/:userId" 
          element={isAuthenticated ? <ERupeeWallet /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wallet/:userId" 
          element={isAuthenticated ? <WalletDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
