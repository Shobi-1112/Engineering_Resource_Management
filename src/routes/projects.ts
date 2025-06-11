import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

router.use(auth);

// All routes require authentication
router.post('/', checkRole(['manager']), createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', checkRole(['manager']), updateProject);
router.delete('/:id', checkRole(['manager']), deleteProject);

export default router; 