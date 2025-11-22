import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserRole } from '../types/enums';

interface TokenPayload {
  id: string;
  username: string;
  role: UserRole;
}

/**
 * Generar Access Token (corta duración)
 */
export const generateAccessToken = (user: {
  _id: Types.ObjectId;
  username: string;
  role: UserRole;
}): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

/**
 * Generar Refresh Token (larga duración)
 */
export const generateRefreshToken = (user: {
  _id: Types.ObjectId;
  username: string;
  role: UserRole;
}): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Verificar Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as TokenPayload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Verificar Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    ) as TokenPayload;
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};
