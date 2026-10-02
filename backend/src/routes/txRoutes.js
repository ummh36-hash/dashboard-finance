import express from 'express';
import { 
  getTransactions, 
  addTransaction, 
  deleteTransaction, 
  getSummary 
} from '../controllers/txController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.get('/summary', getSummary);
router.delete('/:id', deleteTransaction);

export default router;
