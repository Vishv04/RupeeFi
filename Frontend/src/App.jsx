import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AuthForm from './components/AuthForm'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {    
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="pt-24 px-4 min-h-screen flex flex-col items-center">
          <AuthForm />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
