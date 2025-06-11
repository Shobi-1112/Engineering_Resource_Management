import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, requiredSkills, teamSize, status } = req.body;
    const managerId = (req as any).user._id;

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch projects' });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('managerId', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'startDate', 'endDate', 'requiredSkills', 'teamSize', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the project manager
    if (project.managerId.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    updates.forEach(update => (project as any)[update] = req.body[update]);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the project manager
    if (project.managerId.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete project' });
  }
}; 