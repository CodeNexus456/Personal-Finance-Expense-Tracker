import express from 'express';
import path from 'path';
import authRoutes from './server/routes/authRoutes.ts';
import transactionRoutes from './server/routes/transactionRoutes.ts';
import budgetRoutes from './server/routes/budgetRoutes.ts';
import dashboardRoutes from './server/routes/dashboardRoutes.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser middleware
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/budgets', budgetRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'FinTrack API', timestamp: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In development, mount Vite middleware dynamically
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite dev middleware not loaded, falling back to static files:', viteErr);
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    // In production, serve built static files from dist/
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinTrack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start FinTrack server:', err);
});
