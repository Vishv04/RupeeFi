import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import logoRupeeFi from '../../assets/logo-rupeefi.png';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 md:py-12 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10"
          animate={{
            x: [100, 0, 100],
            y: [50, 0, 50],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center sm:items-start"
          >
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-lg flex items-center justify-center"
              >
                {logoRupeeFi ? (
                  <img src={logoRupeeFi} alt="RupeeFi" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="text-white font-bold text-2xl">₹</div>
                )}
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                RupeeFi
              </h2>
            </div>
            <p className="text-gray-300 text-sm text-center sm:text-left">
              Empowering India's digital financial future with secure and innovative solutions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center sm:text-left"
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/home" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="/services" className="hover:text-purple-400 transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center sm:text-left"
          >
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Ahmedabad University</li>
              <li>Gujarat, India</li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center sm:text-left"
          >
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl hover:text-purple-400 transition-colors"
              >
                <FaGithub />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl hover:text-purple-400 transition-colors"
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl hover:text-purple-400 transition-colors"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl hover:text-purple-400 transition-colors"
              >
                <FaInstagram />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-700 text-center"
        >
          <p className="text-sm text-gray-400">CodePirates, Vishv Boda, Deep Patel, Subrat Jain</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 