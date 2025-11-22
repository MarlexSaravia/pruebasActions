import mongoose, { Schema } from 'mongoose';
import { IProjectAssignment } from '../types/interfaces';
import { ProjectRole } from '../types/enums';

const ProjectAssignmentSchema: Schema = new Schema(
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
    roleInProject: {
      type: String,
      enum: Object.values(ProjectRole),
      required: [true, 'El rol en el proyecto es obligatorio'],
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que asignó es obligatorio'],
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    removedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices compuestos para mejorar consultas
ProjectAssignmentSchema.index({ project: 1, user: 1, isActive: 1 });
ProjectAssignmentSchema.index({ user: 1, isActive: 1 });
ProjectAssignmentSchema.index({ project: 1, roleInProject: 1, isActive: 1 });

// Prevenir asignaciones duplicadas (mismo usuario en mismo proyecto activo)
ProjectAssignmentSchema.index(
  { project: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  }
);

// Middleware pre-save para validaciones
ProjectAssignmentSchema.pre('save', async function (next) {
  const assignment = this as IProjectAssignment;

  // Si se está removiendo, establecer removedAt
  if (!assignment.isActive && !assignment.removedAt) {
    assignment.removedAt = new Date();
  }

  next();
});

export default mongoose.model<IProjectAssignment>('ProjectAssignment', ProjectAssignmentSchema);
