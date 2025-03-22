import Login from './components/auth/Login'
import './App.css'
import { Navbar } from './components/common/Navbar/Navbar'
import Herosection from './components/Home/Herosection'
function App() {    
  return (
    <div className="min-h-screen">
      <Navbar />
      <Herosection/>
      <Login />
    </div>
  )
}

export default App
