import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js';

const router = express.Router();

router.get('/:id', protectedRoute, getMessages);
router.post('/send/:id', protectedRoute, sendMessage);
//here the sendMessage route is protected

export default router;
