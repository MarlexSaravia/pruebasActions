import mongoose, { Schema } from 'mongoose';
import { IProject } from '../types/interfaces';
import { ProjectStatus } from '../types/enums';

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del proyecto es obligatorio'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    code: {
      type: String,
      required: [true, 'El código del proyecto es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, 'El código solo puede contener letras mayúsculas, números y guiones'],
    },
    location: {
      type: String,
      required: [true, 'La ubicación es obligatoria'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },
    budget: {
      type: Number,
      required: [true, 'El presupuesto es obligatorio'],
      min: [0, 'El presupuesto no puede ser negativo'],
    },
    currentSpent: {
      type: Number,
      default: 0,
      min: [0, 'El gasto actual no puede ser negativo'],
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (this: IProject, value: Date | null) {
          if (!value) return true;
          return value > this.startDate;
        },
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      },
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVO,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
ProjectSchema.index({ code: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ startDate: 1, endDate: 1 });

// Virtual para calcular el porcentaje de presupuesto usado
ProjectSchema.virtual('budgetUsagePercentage').get(function (this: IProject) {
  if (this.budget === 0) return 0;
  return (this.currentSpent / this.budget) * 100;
});

// Virtual para verificar si el presupuesto fue excedido
ProjectSchema.virtual('isBudgetExceeded').get(function (this: IProject) {
  return this.currentSpent > this.budget;
});

// Asegurar que los virtuals se incluyan al convertir a JSON
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
