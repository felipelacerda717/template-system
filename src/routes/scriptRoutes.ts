// src/routes/scriptRoutes.ts

import express from 'express';
import scriptController from '../controllers/scriptController';
import { authMiddleware, isMasterUser } from '../middleware/authMiddleware';
import { checkClientType } from '../middleware/clientMiddleware';

const router = express.Router();

router.use(authMiddleware);
router.post('/', isMasterUser, scriptController.createScript);
router.put('/:id', isMasterUser, scriptController.updateScript);
router.delete('/:id', isMasterUser, scriptController.deleteScript);

router.get('/', checkClientType, scriptController.getAllScripts);
router.get('/:id', checkClientType, scriptController.getScript);
router.post('/', isMasterUser, scriptController.createScript);
router.put('/:id', isMasterUser, scriptController.updateScript);
router.delete('/:id', isMasterUser, scriptController.deleteScript);
export default router;