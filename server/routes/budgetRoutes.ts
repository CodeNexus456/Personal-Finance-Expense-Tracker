import { Router } from 'express';
import {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(protect);

router.get('/', getBudgets);
router.post('/', setBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
