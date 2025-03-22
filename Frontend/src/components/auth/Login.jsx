import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios';

function Login() {
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
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`, userData
      );

      // Store token and user data including _id from backend response
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        picture: decoded.picture,
        visitCount: response.data.user.visitCount,
        lastVisit: response.data.user.lastVisit
      }));
      
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error processing Google login:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      }
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}

export default Login;