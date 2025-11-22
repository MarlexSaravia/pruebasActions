import { Response } from 'express';
import Expense from '../models/Expense';
import Project from '../models/Project';
import ProjectAssignment from '../models/ProjectAssignment';
import Notification from '../models/Notification';
import { AuthenticatedRequest } from '../types/interfaces';
import { ExpenseStatus, UserRole, ProjectRole, NotificationType } from '../types/enums';
import { uploadImage, deleteImage } from '../config/cloudinary';

/**
 * @route   POST /api/expenses
 * @desc    Registrar nuevo gasto
 * @access  Private
 */
export const createExpense = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId, date, description, amount, category } = req.body;

    // Verificar que el usuario esté asignado al proyecto
    const assignment = await ProjectAssignment.findOne({
      project: projectId,
      user: req.user?.id,
      isActive: true,
    });

    if (!assignment && req.user?.role !== UserRole.MODERADOR) {
      res.status(403).json({
        success: false,
        message: 'No estás asignado a este proyecto',
      });
      return;
    }

    // Subir comprobante si existe
    let receiptUrl, receiptPublicId;
    if (req.file) {
      const upload = await uploadImage(req.file, 'receipts');
      receiptUrl = upload.url;
      receiptPublicId = upload.publicId;
    }

    // Crear gasto
    const expense = await Expense.create({
      project: projectId,
      user: req.user?.id,
      date,
      description,
      amount,
      category,
      receiptUrl,
      receiptPublicId,
    });

    // Notificar a los administradores del proyecto
    const admins = await ProjectAssignment.find({
      project: projectId,
      roleInProject: ProjectRole.ADMINISTRADOR,
      isActive: true,
    });

    for (const admin of admins) {
      await Notification.create({
        user: admin.user,
        type: NotificationType.GASTO_REGISTRADO,
        title: 'Nuevo gasto registrado',
        message: `${req.user?.username} registró un gasto de S/ ${amount}`,
        relatedExpense: expense._id,
        relatedProject: projectId,
      });
    }

    await expense.populate('user', 'fullName username');
    await expense.populate('project', 'name code');

    res.status(201).json({
      success: true,
      message: 'Gasto registrado exitosamente',
      data: expense,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar gasto',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/expenses
 * @desc    Obtener gastos (filtrado según rol y permisos)
 * @access  Private
 */
export const getExpenses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId, status, startDate, endDate } = req.query;
    let filter: any = {};

    // Filtrar por proyecto si se proporciona
    if (projectId) {
      filter.project = projectId;
    }

    // Filtrar por estado
    if (status) {
      filter.status = status;
    }

    // Filtrar por rango de fechas
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    let expenses;

    // MODERADOR y CONTABILIDAD ven todos los gastos
    if (req.user?.role === UserRole.MODERADOR || req.user?.role === UserRole.CONTABILIDAD) {
      expenses = await Expense.find(filter)
        .populate('user', 'fullName username')
        .populate('project', 'name code')
        .populate('approvedBy', 'fullName username')
        .sort({ createdAt: -1 });
    }
    // ADMIN_OBRA ve gastos de sus proyectos
    else if (req.user?.role === UserRole.ADMIN_OBRA) {
      const myProjects = await ProjectAssignment.find({
        user: req.user?.id,
        roleInProject: ProjectRole.ADMINISTRADOR,
        isActive: true,
      }).select('project');

      const projectIds = myProjects.map((p) => p.project);
      filter.project = { $in: projectIds };

      expenses = await Expense.find(filter)
        .populate('user', 'fullName username')
        .populate('project', 'name code')
        .populate('approvedBy', 'fullName username')
        .sort({ createdAt: -1 });
    }
    // TRABAJADOR solo ve sus propios gastos
    else {
      filter.user = req.user?.id;
      expenses = await Expense.find(filter)
        .populate('project', 'name code')
        .populate('approvedBy', 'fullName username')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener gastos',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/expenses/:id/approve
 * @desc    Aprobar gasto
 * @access  Private (MODERADOR o ADMIN_OBRA del proyecto)
 */
export const approveExpense = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      res.status(404).json({ success: false, message: 'Gasto no encontrado' });
      return;
    }

    if (expense.status !== ExpenseStatus.PENDIENTE) {
      res.status(400).json({
        success: false,
        message: 'Solo se pueden aprobar gastos pendientes',
      });
      return;
    }

    // Verificar permisos
    if (req.user?.role !== UserRole.MODERADOR) {
      const isAdmin = await ProjectAssignment.findOne({
        project: expense.project,
        user: req.user?.id,
        roleInProject: ProjectRole.ADMINISTRADOR,
        isActive: true,
      });

      if (!isAdmin) {
        res.status(403).json({ success: false, message: 'No tienes permisos para aprobar este gasto' });
        return;
      }
    }

    // Aprobar gasto
    expense.status = ExpenseStatus.APROBADO;
    expense.approvedBy = req.user?.id as any;
    expense.approvedAt = new Date();
    await expense.save();

    // Actualizar gasto acumulado del proyecto
    await Project.findByIdAndUpdate(expense.project, {
      $inc: { currentSpent: expense.amount },
    });

    // Notificar al usuario
    await Notification.create({
      user: expense.user,
      type: NotificationType.GASTO_APROBADO,
      title: 'Gasto aprobado',
      message: `Tu gasto de S/ ${expense.amount} fue aprobado`,
      relatedExpense: expense._id,
    });

    await expense.populate(['user', 'project', 'approvedBy']);

    res.status(200).json({
      success: true,
      message: 'Gasto aprobado exitosamente',
      data: expense,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al aprobar gasto',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/expenses/:id/reject
 * @desc    Rechazar gasto
 * @access  Private (MODERADOR o ADMIN_OBRA del proyecto)
 */
export const rejectExpense = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({ success: false, message: 'La razón de rechazo es obligatoria' });
      return;
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      res.status(404).json({ success: false, message: 'Gasto no encontrado' });
      return;
    }

    if (expense.status !== ExpenseStatus.PENDIENTE) {
      res.status(400).json({
        success: false,
        message: 'Solo se pueden rechazar gastos pendientes',
      });
      return;
    }

    // Verificar permisos (igual que aprobar)
    if (req.user?.role !== UserRole.MODERADOR) {
      const isAdmin = await ProjectAssignment.findOne({
        project: expense.project,
        user: req.user?.id,
        roleInProject: ProjectRole.ADMINISTRADOR,
        isActive: true,
      });

      if (!isAdmin) {
        res.status(403).json({ success: false, message: 'No tienes permisos para rechazar este gasto' });
        return;
      }
    }

    // Rechazar gasto
    expense.status = ExpenseStatus.RECHAZADO;
    expense.rejectionReason = reason;
    expense.approvedBy = req.user?.id as any;
    expense.approvedAt = new Date();
    await expense.save();

    // Notificar al usuario
    await Notification.create({
      user: expense.user,
      type: NotificationType.GASTO_RECHAZADO,
      title: 'Gasto rechazado',
      message: `Tu gasto de S/ ${expense.amount} fue rechazado: ${reason}`,
      relatedExpense: expense._id,
    });

    await expense.populate(['user', 'project', 'approvedBy']);

    res.status(200).json({
      success: true,
      message: 'Gasto rechazado exitosamente',
      data: expense,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al rechazar gasto',
      error: error.message,
    });
  }
};
