import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {createUser, deleteUser, getAllUsers, updateUser} from "../controllers/users.controller";

const router = Router();

// Get all users (Admin | Council only)
router.get('/', authenticate, authorize(['admin', 'council']), getAllUsers);
// Create a new user (Admin | Council only)
router.post('/', authenticate, authorize(['admin', 'council']), createUser);
// Update a user
router.put('/:userId', authenticate, authorize(['admin', 'council']), updateUser);
// Delete a user
router.delete('/:userId', authenticate, authorize(['admin', 'council']), deleteUser);

export default router;
