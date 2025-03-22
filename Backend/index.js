import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/database.js';
import { cloudinaryConnect } from './config/cloudinary.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

// Configure env
dotenv.config();

const app = express();

// Database connection
dbConnect();
// cloudinaryConnect();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/" , (req,res) => {
    return res.json({
        success: true,
        message: "Boooooooooom, your server is started"
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
