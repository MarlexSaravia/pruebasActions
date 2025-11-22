import { Router } from 'express';
import {
  createProject,
  getProjects,
  assignUserToProject,
  getProjectTeam,
} from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isModerador, isModeradorOrAdmin } from '../middlewares/authorization.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', isModerador, createProject);
router.get('/', getProjects);
router.post('/:projectId/assign', isModeradorOrAdmin, assignUserToProject);
router.get('/:projectId/team', getProjectTeam);

export default router;
