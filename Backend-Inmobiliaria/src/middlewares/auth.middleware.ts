import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/interfaces';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado mediante JWT
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación',
      });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const decoded = verifyAccessToken(token);

    // Agregar usuario a la request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      error: error.message,
    });
  }
};
