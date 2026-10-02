import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import txRoutes from './routes/txRoutes.js';
import './config/database.js'; // Initialize SQLite DB

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'KIMI Finance Backend', timestamp: new Date() });
});

// Root fallback
app.get('/', (req, res) => {
  res.json({ message: 'KIMI Finance API is running smoothly' });
});

app.listen(PORT, () => {
  console.log(`🚀 KIMI Finance Backend Server listening on http://localhost:${PORT}`);
});
