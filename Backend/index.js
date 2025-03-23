import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import dbConnect from "./config/database.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import rewardsRoutes from "./routes/rewards.js";
import kycRoutes from "./routes/kyc.js";
import salaryRoutes from "./routes/salary.js";
import employeeRoutes from "./routes/employee.js";

// Conditionally import routes that might not exist
let paymentRoutes, merchantRoutes, walletRoutes, customerRoutes;

try {
  paymentRoutes = await import("./routes/payment.js");
} catch (error) {
  console.log("Payment routes not found, skipping...");
}

try {
  merchantRoutes = await import("./routes/merchant.js");
} catch (error) {
  console.log("Merchant routes not found, skipping...");
}

try {
  walletRoutes = await import("./routes/wallet.js");
} catch (error) {
  console.log("Wallet routes not found, skipping...");
}

try {
  customerRoutes = await import("./routes/customer.js");
} catch (error) {
  console.log("Customer routes not found, skipping...");
}

// Configure env
dotenv.config();

const app = express();

// Database connection
dbConnect();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true
}));

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/kyc', kycRoutes);

// Conditionally use routes that might not exist
if (merchantRoutes) app.use('/api/merchant', merchantRoutes.default);
if (paymentRoutes) app.use('/api/payment', paymentRoutes.default);
if (walletRoutes) app.use('/api/wallet', walletRoutes.default);
if (customerRoutes) app.use('/api/customer', customerRoutes.default);

// Root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is running successfully",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({
    success: false,
    status,
    message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
