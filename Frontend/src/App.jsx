import { useState } from 'react'
import Login from './components/auth/Login'
import Home from './components/Home/Home'
import './App.css'

function App() {    
  return (
    <div className="min-h-screen bg-gray-950">
      <Login />
      <Home />

    </div>
  )
}

export default App
