import express from 'express';
import authRoutes from '../server/routes/authRoutes.ts';
import transactionRoutes from '../server/routes/transactionRoutes.ts';
import budgetRoutes from '../server/routes/budgetRoutes.ts';
import dashboardRoutes from '../server/routes/dashboardRoutes.ts';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FinTrack API', timestamp: new Date().toISOString() });
});

export default app;
