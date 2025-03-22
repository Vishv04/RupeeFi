import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AuthForm from './components/AuthForm'
import { GoogleOAuthProvider } from '@react-oauth/google'
import InvestmentDashboard from './components/Home/Home'
function App() {    
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="pt-24 px-4 min-h-screen flex flex-col items-center">
          <AuthForm />
        </div>
        <InvestmentDashboard />
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
