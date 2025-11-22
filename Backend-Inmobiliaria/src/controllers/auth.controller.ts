import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler.middleware';
import { AuthenticatedRequest, AuthResponse } from '../types/interfaces';

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Private (Solo MODERADOR o ADMIN_OBRA)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      password,
      fullName,
      role,
      area,
      dni,
      age,
      gender,
      phone,
      email,
      address,
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { dni }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'El usuario, email o DNI ya están registrados',
      });
      return;
    }

    // Crear usuario
    const user = await User.create({
      username,
      password,
      fullName,
      role,
      area,
      dni,
      age,
      gender,
      phone,
      email,
      address,
      createdBy: (req as AuthenticatedRequest).user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios',
      });
      return;
    }

    // Buscar usuario (incluir password para comparación)
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador',
      });
      return;
    }

    // Comparar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const response: AuthResponse = {
      user: {
        id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
      accessToken,
      refreshToken,
    };

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: response,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar access token usando refresh token
 * @access  Public
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token es obligatorio',
      });
      return;
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Buscar usuario
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo',
      });
      return;
    }

    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido o expirado',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Private
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message,
    });
  }
};
