import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const managerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as any).user._id);
    if (!user || user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Manager role required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 