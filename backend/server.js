import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import vaultsRouter from './routes/vaults.js';
import entriesRouter from './routes/entries.js';
import { isDemoMode } from './lib/supabaseAdmin.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusVault Express API',
    mode: isDemoMode ? 'demo-mock' : 'live-supabase',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/vaults', vaultsRouter);
app.use('/api/entries', entriesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 CampusVault API listening on http://localhost:${PORT}`);
  console.log(`📡 Mode: ${isDemoMode ? 'Zero-Config Demo Mode' : 'Connected to Live Supabase'}`);
});
