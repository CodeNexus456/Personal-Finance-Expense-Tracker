import { Router } from 'express';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(protect);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
