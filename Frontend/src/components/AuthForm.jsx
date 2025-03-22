import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from './Button';
import { authAPI } from '../services/api';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(formData);
        localStorage.setItem('token', response.data.token);
        window.location.reload();
      } else {
        if (showOTP) {
          const response = await authAPI.verifyEmail({
            email: formData.email,
            otp
          });
          localStorage.setItem('token', response.data.token);
          window.location.reload();
        } else {
          await authAPI.register(formData);
          setShowOTP(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await authAPI.googleLogin(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-8 text-cyan-500">
        {isLogin ? 'Welcome Back!' : (showOTP ? 'Verify Email' : 'Join codePirates')}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && !showOTP && (
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        )}
        
        {!showOTP && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </>
        )}

        {showOTP && (
          <div>
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Please wait...' : (
            isLogin ? 'Sign In' : (showOTP ? 'Verify Email' : 'Sign Up')
          )}
        </Button>
      </form>

      {!showOTP && (
        <>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="filled_black"
                shape="pill"
                width="100%"
                disabled={loading}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLogin(!isLogin);
                setShowOTP(false);
                setError('');
              }}
              className="ml-2"
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthForm; 