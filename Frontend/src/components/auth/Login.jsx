import { useState } from 'react';
import { authAPI } from '../../services/api';

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(loginData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        // Add navigation logic here
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(registerData);
      if (response.data.success) {
        setIsActive(false);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
      <div className={`relative w-[850px] h-[550px] bg-white m-5 rounded-[30px] shadow-lg overflow-hidden ${isActive ? 'active' : ''}`}>
        {/* Login Form */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-600 ease-in-out delay-[1200ms] ${isActive ? 'right-1/2' : ''}`}>
          <form onSubmit={handleLoginSubmit} className="w-full">
            <h1 className="text-4xl mb-8">Login</h1>
            <div className="relative mb-6">
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-5 py-3 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
              />
              <i className='bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>
            <div className="relative mb-6">
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-5 py-3 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
              />
              <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>
            <div className="text-right mb-6">
              <a href="#" className="text-sm text-gray-800 hover:underline">Forgot Password?</a>
            </div>
            <button type="submit" className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white text-base font-semibold hover:bg-[#6384dc] transition-colors">
              Login
            </button>
            <p className="my-4 text-sm">or login with social platforms</p>
            <div className="flex justify-center gap-4">
              <a className="p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 hover:border-gray-400 transition-colors">
                <i className='bx bxl-google'></i>
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-600 ease-in-out ${isActive ? 'visible' : 'invisible'}`}>
          <form onSubmit={handleRegisterSubmit} className="w-full">
            <h1 className="text-4xl mb-8">Registration</h1>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Username" 
                required
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                className="w-full px-5 py-3 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
              />
              <i className='bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>
            <div className="relative mb-6">
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className="w-full px-5 py-3 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
              />
              <i className='bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>
            <div className="relative mb-6">
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full px-5 py-3 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
              />
              <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>
            <button type="submit" className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white text-base font-semibold hover:bg-[#6384dc] transition-colors">
              Register
            </button>
          </form>
        </div>

        {/* Toggle Box */}
        <div className="absolute w-full h-full">
          <div className={`absolute w-[300%] h-full bg-[#7494ec] -left-[250%] rounded-[150px] z-20 transition-all duration-[1800ms] ease-in-out ${isActive ? 'left-1/2' : ''}`}></div>

          {/* Left Panel */}
          <div className={`absolute w-1/2 h-full flex flex-col justify-center items-center text-white z-20 transition-all duration-600 ease-in-out delay-[1200ms] ${isActive ? '-left-1/2 delay-[600ms]' : 'left-0'}`}>
            <h1 className="text-4xl mb-4">Hello, Welcome!</h1>
            <p className="mb-5">Don't have an account?</p>
            <button 
              onClick={() => setIsActive(true)}
              className="w-40 h-[46px] border-2 border-white rounded-lg text-white text-base font-semibold hover:bg-white/10 transition-colors"
            >
              Register
            </button>
          </div>

          {/* Right Panel */}
          <div className={`absolute w-1/2 h-full flex flex-col justify-center items-center text-white z-20 transition-all duration-600 ease-in-out ${isActive ? 'right-0 delay-[1200ms]' : '-right-1/2 delay-[600ms]'}`}>
            <h1 className="text-4xl mb-4">Welcome Back!</h1>
            <p className="mb-5">Already have an account?</p>
            <button 
              onClick={() => setIsActive(false)}
              className="w-40 h-[46px] border-2 border-white rounded-lg text-white text-base font-semibold hover:bg-white/10 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 