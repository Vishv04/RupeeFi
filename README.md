# RupeeFi - Digital Payment Platform 💸

RupeeFi is an innovative digital payment platform designed to convert UPI balance into e-Rupee balance, aiming to promote the adoption of e-Rupee in everyday transactions. Built with modern technologies and secure practices, the platform balances functionality, fun, and finance.

## Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Project Setup](#-project-setup)
- [Configuration](#-configuration)
- [How to Get API Keys](#-how-to-get-api-keys)
- [Guidelines](#-guidelines)

## Features

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

## Project Structure
- **RupeeFi/**
  - **Frontend/**
    - **src/**
      - **assets/**
      - **components/**
      - **lib/**
      - **services/**
      - **App.jsx**
    - **.env**  
    - **index.html**
  - **Backend/**
    - **config/**
    - **controllers/**
    - **middleware/**
    - **models/**
    - **routes/**
    - **utils/**
    - **.env**
    - **index.js**

## Project Setup

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- The frontend will run on: [http://localhost:5173](http://localhost:5173)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

- The backend server will run on: [http://localhost:3000](http://localhost:3000)

---

## Configuration

### Frontend (`frontend/.env`)

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Backend (`backend/.env`)

```
PORT=3000
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## How to Get API Keys

### 1. Google Client ID
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a project
- Go to “OAuth consent screen” → configure
- Go to “Credentials” → “Create credentials” → OAuth Client ID
- Choose Web App and add `http://localhost:5173` to redirect URIs
- Copy the **Client ID**

### 2. Razorpay Key
- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Sign in → Settings → API Keys → Generate Key
- Copy **Key ID** and **Key Secret**

### 3. Gemini API Key (Google AI)
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Sign in and generate your API key

### 4. MongoDB URI
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a project & cluster
- Go to “Database Access” → Create user
- Go to “Network Access” → Allow access from anywhere
- Go to “Clusters” → Connect → Choose “Connect your application”
- Copy the **connection string**

---

## Guidelines 

### 1. Fork the Repository
Create your own copy of the project by clicking the **Fork** button.

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/rupeefi.git
cd rupeefi
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/YourFeatureName
```

### 4. Make Your Changes
Work on the frontend (`/frontend`) or backend (`/backend`) as needed.

### 5. Build check
Make sure your code follows production build setup:
```bash
npm run build
```

### 6. Commit and Push
```bash
git add .
git commit -m "Add: Short description of your feature"
git push origin feature/YourFeatureName
```

### 7. Open a Pull Request
Go to your forked repo → “Compare & pull request” → Describe your change & add images in needed → Submit PR.

---

Thank you for contributing to Rupeefi! 💖

### ⚠️ Contribution Note

> **Important:** If you are using any AI-assisted tools (like GitHub Copilot, ChatGPT, etc.) while writing your code, please ensure that the changes are:
> - Relevant **only** to the feature or bug you are working on.
> - Do **not** affect unrelated files, components, or styles.
> - Properly tested and reviewed before raising a pull request.

✅ **Always review your code before committing.** Irrelevant or auto-generated changes to other parts of the project will not be accepted.

