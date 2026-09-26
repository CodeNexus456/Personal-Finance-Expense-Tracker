import { Router } from 'express';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect); // All transaction routes are protected

router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
