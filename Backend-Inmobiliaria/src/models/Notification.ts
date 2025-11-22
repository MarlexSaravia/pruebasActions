import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types/interfaces';
import { NotificationType } from '../types/enums';

const NotificationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, 'El tipo de notificación es obligatorio'],
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true,
      maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres'],
    },
    relatedExpense: {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
      default: null,
    },
    relatedProject: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1 });
NotificationSchema.index({ createdAt: -1 });

// Virtual para tiempo relativo (ej: "Hace 2 horas")
NotificationSchema.virtual('relativeTime').get(function (this: INotification) {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
});

NotificationSchema.set('toJSON', { virtuals: true });
NotificationSchema.set('toObject', { virtuals: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
