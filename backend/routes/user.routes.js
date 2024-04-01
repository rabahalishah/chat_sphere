import express from 'express';
import protectedRoute from '../middlewares/protectedRoute.js';
import { getUsersForSidebar } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', protectedRoute, getUsersForSidebar);

export default router;
