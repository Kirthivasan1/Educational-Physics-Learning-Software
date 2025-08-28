import express from 'express';
import { createPhysicsObject, getAllPhysicsObjects } from '../controllers/physicsObjectController.js';

const router = express.Router();

router.post('/', createPhysicsObject);
router.get('/', getAllPhysicsObjects);

export default router;
