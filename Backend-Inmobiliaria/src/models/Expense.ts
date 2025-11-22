import mongoose, { Schema } from 'mongoose';
import { IExpense } from '../types/interfaces';
import { ExpenseStatus, ExpenseCategory } from '../types/enums';

const ExpenseSchema: Schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'El proyecto es obligatorio'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    date: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    amount: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0.01, 'El monto debe ser mayor a 0'],
    },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: [true, 'La categoría es obligatoria'],
    },
    status: {
      type: String,
      enum: Object.values(ExpenseStatus),
      default: ExpenseStatus.PENDIENTE,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    receiptPublicId: {
      type: String,
      default: null,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'La razón de rechazo no puede exceder 500 caracteres'],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para mejorar consultas
ExpenseSchema.index({ project: 1, status: 1 });
ExpenseSchema.index({ user: 1, status: 1 });
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ status: 1, createdAt: -1 });
ExpenseSchema.index({ project: 1, date: -1 });

// Validación: Si está rechazado, debe tener razón
ExpenseSchema.pre('save', function (next) {
  const expense = this as IExpense;

  if (expense.status === ExpenseStatus.RECHAZADO && !expense.rejectionReason) {
    return next(new Error('Los gastos rechazados deben incluir una razón'));
  }

  if (expense.status === ExpenseStatus.APROBADO && !expense.approvedBy) {
    return next(new Error('Los gastos aprobados deben tener un aprobador'));
  }

  next();
});

// Virtual para formatear el monto
ExpenseSchema.virtual('formattedAmount').get(function (this: IExpense) {
  return `S/ ${this.amount.toFixed(2)}`;
});

// Asegurar que los virtuals se incluyan al convertir a JSON
ExpenseSchema.set('toJSON', { virtuals: true });
ExpenseSchema.set('toObject', { virtuals: true });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
