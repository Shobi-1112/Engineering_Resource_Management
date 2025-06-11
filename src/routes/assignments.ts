import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import {
  getAllAssignments,
  getEngineerAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getEngineerCapacity
} from '../controllers/assignmentController';

const router = express.Router();

// Public routes (require authentication)
router.get('/', auth, getAllAssignments);
router.get('/engineer/:engineerId', auth, getEngineerAssignments);
router.get('/engineer/:engineerId/capacity', auth, getEngineerCapacity);

// Manager-only routes
router.post('/', [auth, checkRole(['manager'])], createAssignment);
router.put('/:id', [auth, checkRole(['manager'])], updateAssignment);
router.delete('/:id', [auth, checkRole(['manager'])], deleteAssignment);

export default router; 