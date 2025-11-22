import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import expenseRoutes from './expense.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/expenses', expenseRoutes);

export default router;
