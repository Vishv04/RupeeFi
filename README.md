# RupeeFi - Digital Payment Platform 💸

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![React](https://img.shields.io/badge/react-%5E18.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node-%5E18.0.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%5E6.0.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

RupeeFi is a comprehensive digital payment platform that integrates e-Rupee transactions with gamified rewards, merchant services, and AI-powered support.

![RupeeFi Platform](./assets/platform-demo.gif)

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Configuration](#%EF%B8%8F-configuration)
- [API Documentation](#-api-documentation)
- [Components](#-components)

## ✨ Features

### User Features
- **e-Rupee Integration**: Seamless digital currency transactions
- **Rewards System**: 
  - Spin wheel rewards
  - Scratch cards
  - Daily bonuses
- **AI Support**: Gemini-powered chatbot assistance
- **UPI Integration**: Direct UPI payment support
- **Transaction History**: Detailed payment records
- **Profile Management**: User profile and settings

### Merchant Features
- **Business Dashboard**: Comprehensive transaction overview
- **Payment Analytics**: Detailed business insights
- **QR Code Generation**: Easy payment collection
- **Employee Management**: Multi-user access control
- **Discount Management**: Payment method-specific discounts

### Security Features
- **Google OAuth**: Secure authentication
- **JWT Implementation**: Protected API endpoints
- **UPI PIN Verification**: Secure transactions
- **Rate Limiting**: DDoS protection

## 🏗 System Architecture
- **Frontend (React + Vite)**  
  - **User Interface**  
    - Authentication  
    - Dashboard  
    - Payments  
    - Rewards  
    - Profile  
  - **Merchant Interface**  
    - Dashboard  
    - Analytics  
    - Employees  
    - Settings  

- **Backend (Node.js + Express)**  
  - API Routes  
  - Controllers  
  - Models  
  - Middleware  
  - Services  


## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm/yarn

### Frontend Setup
cd Frontend
npm install
npm run dev

### Backend Setup
cd Backend
npm install
npm run dev


## 📁 Project Structure
- **RupeeFi/**
  - **Frontend/**
    - **src/**
      - **components/**
        - **auth/**
        - **chatbot/**
        - **common/**
        - **dashboard/**
        - **merchant/**
        - **rewards/**
      - **services/**
      - **assets/**
      - **App.jsx**
    - **index.html**
  - **Backend/**
    - **routes/**
    - **controllers/**
    - **models/**
    - **middleware/**
    - **app.js**


## 📡 API Documentation

### **Authentication Endpoints**  
- **POST** `/api/auth/google-login`  
- **POST** `/api/auth/logout`  

---

### **User Endpoints**  
- **GET** `/api/user/profile`  
- **PUT** `/api/user/profile`  
- **DELETE** `/api/user/profile`  

---

### **Payment Endpoints**  
- **POST** `/api/payment/phonepe`  
- **POST** `/api/payment/link-account`  
- **POST** `/api/transfer/verify-upi-pin`  
- **POST** `/api/transfer/transfer-to-erupee`  

---

### **Merchant Endpoints**  
- **POST** `/api/merchant/register`  
- **POST** `/api/merchant/login`  
- **GET** `/api/merchant/dashboard-stats`  
- **PUT** `/api/merchant/payment-methods`  

---

### **Rewards Endpoints**  
- **GET** `/api/rewards/spins-available`  
- **POST** `/api/rewards/spin`  
- **GET** `/api/rewards/scratch-cards`  
- **POST** `/api/rewards/scratch`  


## 🎨 Components

### Core Components
- **Authentication**: Google OAuth integration
- **Dashboard**: Transaction overview and analytics
- **Payments**: UPI and e-Rupee transactions
- **Rewards**: Spin wheel and scratch cards
- **Chatbot**: AI-powered support system
- **Merchant Dashboard**: Business management interface

### Shared Components
- **Navbar**: Navigation and user menu
- **Loading States**: Unified loading indicators
- **Error Boundaries**: Error handling components
- **Modal Windows**: Reusable modal system
- **Form Components**: Standardized form elements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request


## Acknowledgments

- Google OAuth for authentication
- PhonePe for payment processing
- Google Gemini AI for chatbot
- MongoDB for database
- Express.js for backend
- React for frontend
- Tailwind CSS for styling
- Framer Motion for animations

---

## 🔍 Support

For support:
- Open an issue on GitHub
- Contact the RupeeFi team
---
