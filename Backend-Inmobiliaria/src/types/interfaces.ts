import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { UserRole, ProjectStatus, ExpenseStatus, ExpenseCategory, NotificationType, ProjectRole } from './enums';

/**
 * Usuario extendido para requests autenticados
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    username: string;
  };
}

/**
 * Interfaz de Usuario (para Mongoose Document)
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  area: string;
  dni: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  profilePhoto?: string;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Métodos
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Interfaz de Proyecto/Obra
 */
export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  location: string;
  description: string;
  budget: number;
  currentSpent: number;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interfaz de Asignación de Personal a Proyecto
 */
export interface IProjectAssignment extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  user: Types.ObjectId;
  roleInProject: ProjectRole;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
  removedAt?: Date;
  isActive: boolean;
}

/**
 * Interfaz de Gasto
 */
export interface IExpense extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  user: Types.ObjectId;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  receiptUrl?: string;
  receiptPublicId?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interfaz de Notificación
 */
export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedExpense?: Types.ObjectId;
  relatedProject?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

/**
 * DTOs para requests
 */
export interface RegisterDTO {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  area: string;
  dni: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface CreateProjectDTO {
  name: string;
  code: string;
  location: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate?: Date;
}

export interface CreateExpenseDTO {
  projectId: string;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

export interface ApproveExpenseDTO {
  expenseId: string;
}

export interface RejectExpenseDTO {
  expenseId: string;
  reason: string;
}

export interface AssignToProjectDTO {
  projectId: string;
  userId: string;
  roleInProject: ProjectRole;
}

/**
 * Responses
 */
export interface AuthResponse {
  user: {
    id: string;
    username: string;
    fullName: string;
    role: UserRole;
    email: string;
    profilePhoto?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
