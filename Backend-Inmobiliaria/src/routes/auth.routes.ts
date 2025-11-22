import { Router } from 'express';
import { register, login, refreshToken, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isModeradorOrAdmin } from '../middlewares/authorization.middleware';

const router = Router();

// Rutas públicas
router.post('/login', login);
router.post('/refresh', refreshToken);

// Rutas protegidas
router.post('/register', authenticate, isModeradorOrAdmin, register);
router.get('/me', authenticate, getMe);

export default router;
