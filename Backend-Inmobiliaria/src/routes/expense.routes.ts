import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  approveExpense,
  rejectExpense,
} from '../controllers/expense.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { canApproveExpenses } from '../middlewares/authorization.middleware';
import { upload, handleMulterError } from '../middlewares/upload.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', upload.single('receipt'), handleMulterError, createExpense);
router.get('/', getExpenses);
router.put('/:id/approve', canApproveExpenses, approveExpense);
router.put('/:id/reject', canApproveExpenses, rejectExpense);

export default router;
