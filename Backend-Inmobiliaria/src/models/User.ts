import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/interfaces';
import { UserRole } from '../types/enums';

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
      maxlength: [50, 'El usuario no puede exceder 50 caracteres'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No devolver password por defecto en queries
    },
    fullName: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TRABAJADOR,
      required: true,
    },
    area: {
      type: String,
      required: [true, 'El área es obligatoria'],
      trim: true,
    },
    dni: {
      type: String,
      required: [true, 'El DNI es obligatorio'],
      unique: true,
      trim: true,
      match: [/^\d{8}$/, 'El DNI debe tener 8 dígitos'],
    },
    age: {
      type: Number,
      required: [true, 'La edad es obligatoria'],
      min: [18, 'La edad mínima es 18 años'],
      max: [100, 'Edad inválida'],
    },
    gender: {
      type: String,
      required: [true, 'El género es obligatorio'],
      enum: ['Masculino', 'Femenino', 'Otro'],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^\d{9}$/, 'El teléfono debe tener 9 dígitos'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido'],
    },
    address: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para mejorar performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ dni: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Hook pre-save: Hashear password antes de guardar
UserSchema.pre('save', async function (next) {
  const user = this;

  // Solo hashear si el password fue modificado
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Método para obtener datos públicos del usuario
UserSchema.methods.toPublicJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model<IUser>('User', UserSchema);
