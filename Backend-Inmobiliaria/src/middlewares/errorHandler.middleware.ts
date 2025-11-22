import { Request, Response, NextFunction } from 'express';

/**
 * Clase de error personalizada
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', error);

  // Error de Mongoose - Validación
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: Object.values((error as any).errors).map((err: any) => err.message),
    });
    return;
  }

  // Error de Mongoose - Duplicado (unique constraint)
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(400).json({
      success: false,
      message: `El campo '${field}' ya está en uso`,
    });
    return;
  }

  // Error de Mongoose - CastError (ID inválido)
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
    return;
  }

  // Error personalizado (AppError)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Error genérico
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};
