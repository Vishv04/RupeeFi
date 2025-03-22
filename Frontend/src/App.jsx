import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { useState } from 'react';
import './App.css';
import { Navbar } from './components/common/Navbar/Navbar'
import Herosection from './components/Home/Herosection'
import MerchantDashboard from './components/Merchant/MerchantDashboard'

// NavbarWrapper component to conditionally render navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't render navbar on merchant page
  return location.pathname !== '/merchant' ? <Navbar /> : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <NavbarWrapper />
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
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
