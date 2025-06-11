import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { User } from '../models/User';
import { Project } from '../models/Project';

// Get all assignments
export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .populate('engineerId', 'name email skills seniority')
      .populate('projectId', 'name description status');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

// Get engineer's assignments
export const getEngineerAssignments = async (req: Request, res: Response) => {
  try {
    const { engineerId } = req.params;
    const assignments = await Assignment.find({ engineerId })
      .populate('projectId', 'name description status')
      .sort({ startDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engineer assignments' });
  }
};

// Create new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;

    // Check if engineer exists and is an engineer
    const engineer = await User.findOne({ _id: engineerId, role: 'engineer' });
    if (!engineer) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if manager is authorized
    if (project.managerId.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to assign to this project' });
    }

    // Check engineer's current capacity
    const currentAssignments = await Assignment.find({
      engineerId,
      status: 'active',
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    const totalAllocated = currentAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    const availableCapacity = engineer.maxCapacity - totalAllocated;

    if (allocationPercentage > availableCapacity) {
      return res.status(400).json({
        error: 'Engineer does not have enough capacity',
        availableCapacity,
        requested: allocationPercentage
      });
    }

    // Create assignment
    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create assignment' });
  }
};

// Update assignment
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // If updating allocation percentage, check capacity
    if (updates.allocationPercentage) {
      const engineer = await User.findById(assignment.engineerId);
      if (!engineer) {
        return res.status(404).json({ error: 'Engineer not found' });
      }

      const currentAssignments = await Assignment.find({
        engineerId: assignment.engineerId,
        _id: { $ne: id },
        status: 'active',
        $or: [
          {
            startDate: { $lte: assignment.endDate },
            endDate: { $gte: assignment.startDate }
          }
        ]
      });

      const totalAllocated = currentAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
      const availableCapacity = engineer.maxCapacity - totalAllocated;

      if (updates.allocationPercentage > availableCapacity) {
        return res.status(400).json({
          error: 'Engineer does not have enough capacity',
          availableCapacity,
          requested: updates.allocationPercentage
        });
      }
    }

    Object.assign(assignment, updates);
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update assignment' });
  }
};

// Delete assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete assignment' });
  }
};

// Get engineer's available capacity
export const getEngineerCapacity = async (req: Request, res: Response) => {
  try {
    const { engineerId } = req.params;
    const { startDate, endDate } = req.query;

    const engineer = await User.findById(engineerId);
    if (!engineer) {
      return res.status(404).json({ error: 'Engineer not found' });
    }

    const query: any = {
      engineerId,
      status: 'active'
    };

    if (startDate && endDate) {
      query.$or = [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ];
    }

    const assignments = await Assignment.find(query);
    const totalAllocated = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    const availableCapacity = engineer.maxCapacity - totalAllocated;

    res.json({
      maxCapacity: engineer.maxCapacity,
      totalAllocated,
      availableCapacity,
      assignments
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate engineer capacity' });
  }
}; 