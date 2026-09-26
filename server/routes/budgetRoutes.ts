import { Router } from 'express';
import {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect); // All budget routes are protected

router.get('/', getBudgets);
router.post('/', setBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
