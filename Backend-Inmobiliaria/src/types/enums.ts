/**
 * Roles del sistema - Estructura jerárquica
 */
export enum UserRole {
  MODERADOR = 'MODERADOR',           // Dueño/Gerente - Nivel más alto
  ADMIN_OBRA = 'ADMIN_OBRA',         // Administrador de obra
  TRABAJADOR = 'TRABAJADOR',         // Trabajador estándar
  CONTABILIDAD = 'CONTABILIDAD',     // Rol de solo lectura
}

/**
 * Estados de un proyecto/obra
 */
export enum ProjectStatus {
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  FINALIZADO = 'FINALIZADO',
}

/**
 * Estados de un gasto
 */
export enum ExpenseStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

/**
 * Categorías de gastos
 */
export enum ExpenseCategory {
  TRANSPORTE = 'TRANSPORTE',
  MATERIALES = 'MATERIALES',
  HERRAMIENTAS = 'HERRAMIENTAS',
  ALIMENTACION = 'ALIMENTACION',
  SERVICIOS = 'SERVICIOS',
  MANTENIMIENTO = 'MANTENIMIENTO',
  OTROS = 'OTROS',
}

/**
 * Tipos de notificaciones
 */
export enum NotificationType {
  GASTO_REGISTRADO = 'GASTO_REGISTRADO',
  GASTO_APROBADO = 'GASTO_APROBADO',
  GASTO_RECHAZADO = 'GASTO_RECHAZADO',
  ASIGNACION_OBRA = 'ASIGNACION_OBRA',
  ASIGNACION_ADMINISTRADOR = 'ASIGNACION_ADMINISTRADOR',
  PRESUPUESTO_EXCEDIDO = 'PRESUPUESTO_EXCEDIDO',
  OBRA_CREADA = 'OBRA_CREADA',
  INFO = 'INFO',
}

/**
 * Rol dentro de un proyecto específico
 */
export enum ProjectRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  TRABAJADOR = 'TRABAJADOR',
}
