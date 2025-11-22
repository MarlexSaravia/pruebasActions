import { Response } from 'express';
import Project from '../models/Project';
import ProjectAssignment from '../models/ProjectAssignment';
import { AuthenticatedRequest } from '../types/interfaces';
import { UserRole, ProjectRole } from '../types/enums';

/**
 * @route   POST /api/projects
 * @desc    Crear nuevo proyecto (Solo MODERADOR)
 * @access  Private
 */
export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, code, location, description, budget, startDate, endDate } = req.body;

    const project = await Project.create({
      name,
      code,
      location,
      description,
      budget,
      startDate,
      endDate,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al crear proyecto',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/projects
 * @desc    Obtener todos los proyectos (filtrado según rol)
 * @access  Private
 */
export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let projects;

    // MODERADOR y CONTABILIDAD ven todos
    if (req.user?.role === UserRole.MODERADOR || req.user?.role === UserRole.CONTABILIDAD) {
      projects = await Project.find().populate('createdBy', 'fullName username').sort({ createdAt: -1 });
    } else {
      // Otros ven solo proyectos donde están asignados
      const assignments = await ProjectAssignment.find({
        user: req.user?.id,
        isActive: true,
      }).select('project');

      const projectIds = assignments.map((a) => a.project);
      projects = await Project.find({ _id: { $in: projectIds } })
        .populate('createdBy', 'fullName username')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/projects/:projectId/assign
 * @desc    Asignar usuario a proyecto
 * @access  Private (MODERADOR o ADMIN_OBRA del proyecto)
 */
export const assignUserToProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { userId, roleInProject } = req.body;

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
      return;
    }

    // Verificar permisos (MODERADOR o ADMIN del proyecto)
    if (req.user?.role !== UserRole.MODERADOR) {
      const isAdmin = await ProjectAssignment.findOne({
        project: projectId,
        user: req.user?.id,
        roleInProject: ProjectRole.ADMINISTRADOR,
        isActive: true,
      });

      if (!isAdmin) {
        res.status(403).json({ success: false, message: 'No tienes permisos para asignar en este proyecto' });
        return;
      }
    }

    // Crear asignación
    const assignment = await ProjectAssignment.create({
      project: projectId,
      user: userId,
      roleInProject,
      assignedBy: req.user?.id,
    });

    await assignment.populate('user', 'fullName username role');

    res.status(201).json({
      success: true,
      message: 'Usuario asignado exitosamente',
      data: assignment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al asignar usuario',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/projects/:projectId/team
 * @desc    Obtener equipo del proyecto
 * @access  Private
 */
export const getProjectTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const team = await ProjectAssignment.find({
      project: projectId,
      isActive: true,
    })
      .populate('user', 'fullName username role email phone')
      .populate('assignedBy', 'fullName username')
      .sort({ assignedAt: -1 });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener equipo',
      error: error.message,
    });
  }
};
