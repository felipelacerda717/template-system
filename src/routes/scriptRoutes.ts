// src/routes/scriptRoutes.ts

import express from 'express';
import scriptController from '../controllers/scriptController';

const router = express.Router();

router.get('/', scriptController.getAllScripts);
router.get('/:id', scriptController.getScript);
router.post('/', scriptController.createScript);
router.put('/:id', scriptController.updateScript);
router.delete('/:id', scriptController.deleteScript);

export default router;