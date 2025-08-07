import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/common/Navbar/Navbar';
import Herosection from './components/Home/HeroSection';
import Profile from './components/profile/Profile';
import Footer from './components/common/Footer';

import MerchantDashboard from './components/Merchant/MerchantDashboard'
import MerchantLogin from './components/Merchant/MerchantLogin';
import MerchantRegister from './components/Merchant/MerchantRegister';
import MerchantLanding from './components/Merchant/MerchantLanding';
import RewardsPage from './components/rewards/RewardsPage';
import ChatButton from './components/chatbot/ChatButton';
import UPIWallet from './components/wallet/UPIWallet';
import ERupeeWallet from './components/wallet/ERupeeWallet';
import BlockchainViewer from './components/BlockchainViewer';
import Transfer from './components/Transfer';
import ScrollToTop from './components/scrollTotop';
import RupeeFiabout from './components/about/RupeeFiabout';
// NavbarWrapper component to conditionally render navbar
const NavbarWrapper = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  // Don't render navbar on merchant pages
  return !location.pathname.startsWith('/merchant') ? (
    <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
  ) : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isMerchantAuthenticated, setIsMerchantAuthenticated] = useState(!!localStorage.getItem('merchantToken'));

  // Check for merchant authentication on mount and token changes
  useEffect(() => {
    setIsMerchantAuthenticated(!!localStorage.getItem('merchantToken'));
  }, [localStorage.getItem('merchantToken')]);

  // Check existing merchant auth on initial load
  useEffect(() => {
    const checkMerchantAuth = () => {
      const token = localStorage.getItem('merchantToken');
      if (token) {
        console.log('Merchant token found in localStorage');
        setIsMerchantAuthenticated(true);
      }
    };
    
    checkMerchantAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleMerchantLogout = () => {
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchant');
    setIsMerchantAuthenticated(false);
    window.location.href = '/merchant';
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavbarWrapper isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-grow">
        <ScrollToTop />
          <Routes>
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
            
            {/* Merchant Routes */}
            <Route path="/merchant" element={<MerchantLanding />} />
            <Route 
              path="/merchant/login" 
              element={isMerchantAuthenticated ? <Navigate to="/merchant/dashboard" /> : <MerchantLogin setIsMerchantAuthenticated={setIsMerchantAuthenticated} />} 
            />
            <Route 
              path="/merchant/register" 
              element={isMerchantAuthenticated ? <Navigate to="/merchant/dashboard" /> : <MerchantRegister setIsMerchantAuthenticated={setIsMerchantAuthenticated} />} 
            />
            {/* The dashboard route needs to handle both the root path and sub-paths */}
            <Route 
              path="/merchant/dashboard" 
              element={isMerchantAuthenticated ? <MerchantDashboard onLogout={handleMerchantLogout} /> : <Navigate to="/merchant/login" />} 
            />
            <Route 
              path="/merchant/dashboard/*" 
              element={isMerchantAuthenticated ? <MerchantDashboard onLogout={handleMerchantLogout} /> : <Navigate to="/merchant/login" />} 
            />
            
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/rewards" 
              element={isAuthenticated ? <RewardsPage /> : <Navigate to="/login" />} 
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
          path="/blockchain" 
          element={isAuthenticated ? <BlockchainViewer /> : <Navigate to="/login" />} 
        />

        {/* Wallet Routes */}
        <Route 
          path="/wallet/upi" 
          element={isAuthenticated ? <UPIWallet /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/wallet/erupee" 
          element={isAuthenticated ? <ERupeeWallet /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/about" 
          element={<RupeeFiabout />} 
        />
      </Routes>
        </main>
        <Footer />
        <ChatButton />
      </div>
    </Router>
  );
}

export default App;
