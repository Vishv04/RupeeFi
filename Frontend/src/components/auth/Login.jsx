import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode.jwtDecode(credentialResponse.credential);

      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub,
        token: credentialResponse.credential
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
        userData
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error.response?.data || error.message);
      setError('Failed to login with Google. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            useOneTap
          />
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default Login;