import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios';
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
          >
            Welcome to RupeeFi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            Sign in to access your account
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            shape="pill"
            size="large"
            text="continue_with"
            locale="en"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          By continuing, you agree to RupeeFi's
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500 ml-1">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;