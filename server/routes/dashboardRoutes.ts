import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(protect);

router.get('/stats', getDashboardStats);

export default router;
