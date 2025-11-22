import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/interfaces';
import { UserRole } from '../types/enums';

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para verificar que sea MODERADOR
 */
export const isModerador = authorize(UserRole.MODERADOR);

/**
 * Middleware para verificar que sea MODERADOR o ADMIN_OBRA
 */
export const isModeradorOrAdmin = authorize(UserRole.MODERADOR, UserRole.ADMIN_OBRA);

/**
 * Middleware para verificar que sea CONTABILIDAD (solo lectura)
 */
export const isContabilidad = authorize(UserRole.CONTABILIDAD);

/**
 * Middleware para verificar que pueda ver todos los gastos
 */
export const canViewAllExpenses = authorize(
  UserRole.MODERADOR,
  UserRole.ADMIN_OBRA,
  UserRole.CONTABILIDAD
);

/**
 * Middleware para verificar que pueda aprobar gastos
 */
export const canApproveExpenses = authorize(UserRole.MODERADOR, UserRole.ADMIN_OBRA);
