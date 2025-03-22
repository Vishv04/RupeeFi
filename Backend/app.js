import cors from 'cors';
import paymentRoutes from './routes/payment.js';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api/payment', paymentRoutes); 